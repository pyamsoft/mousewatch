import { DateTime } from "luxon";
import { newLogger } from "../bot/logger";
import {
  MessageHandler,
  messageHandlerHelpText,
  messageHandlerOutput,
} from "../bot/message/MessageHandler";
import {
  messageFromMsg,
  Msg,
  sendChannelFromMessage,
} from "../bot/message/Msg";
import { KeyedObject } from "../bot/model/KeyedObject";
import { BotConfig } from "../config";
import { parseDate } from "../looper/DateParser";
import { ParkCalendarLookupLooper } from "../looper/ParkCalendarLookupLooper";
import { ParkCalendarLookupHandler } from "../looper/ParkCalendarLooupHandler";
import { ParkWatchCache } from "../looper/ParkWatchCache";
import { WatchAlertMessageCache } from "../looper/WatchAlertMessageCache";
import { ParkCommand, ParkCommandType } from "./command";
import { watchEntryFromMessage } from "./model/WatchEntry";
import { outputParkAvailability } from "./outputs/availability";
import { outputDateErrorText } from "./outputs/dateerror";
import { outputWatchStarted } from "./outputs/watch";

const TAG = "WatchHandler";
const logger = newLogger(TAG);

export const WatchHandler: MessageHandler = {
  tag: TAG,

  handle: function (
    // @ts-ignore
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
      message: Msg;
    }
  ) {
    const { currentCommand, message } = command;
    if (
      currentCommand.isHelpCommand ||
      currentCommand.type !== ParkCommandType.WATCH
    ) {
      return;
    }

    logger.log("Handle watch message", currentCommand);
    const { dates, magicKey } = currentCommand;

    const dateList: DateTime[] = [];
    for (const d of dates) {
      const parsedDate = parseDate(d);
      if (parsedDate) {
        dateList.push(parsedDate);
      } else {
        logger.warn("Failed to parse date string: ", d);
        return Promise.resolve(messageHandlerHelpText(outputDateErrorText(d)));
      }
    }

    return ParkCalendarLookupHandler.lookup(magicKey, dateList).then(
      (results) => {
        const messages: KeyedObject<string> = {};
        const notFoundDates: DateTime[] = [];

        for (const d of dateList) {
          const res = results.find((r) => d === r.targetDate);
          const key = d.toISO();

          // If we have availability, don't watch just immediately output
          if (res && res.parkResponse.available) {
            messages[key] = outputParkAvailability(undefined, res);
          } else {
            messages[key] = outputWatchStarted(magicKey, d);
            notFoundDates.push(d);

            ParkWatchCache.addWatch(
              watchEntryFromMessage({
                message,
                magicKey,
                targetDate: d,
              })
            );
          }
        }

        if (notFoundDates.length > 0) {
          sideEffectWatchLoop(notFoundDates, message);
        }

        return messageHandlerOutput(messages);
      }
    );
  },
};

const sideEffectWatchLoop = function (dateList: DateTime[], message: Msg) {
  const discordMsg = messageFromMsg(message);
  const sender = sendChannelFromMessage(discordMsg);

  ParkCalendarLookupLooper.loop((results) => {
    for (const d of dateList) {
      const res = results.find((r) => d === r.targetDate);
      if (res && res.parkResponse.available) {
        const msg = outputParkAvailability(res.userId, res);

        // This alert message is uncached and thus uneditable by the robot.
        sender
          .send(msg)
          .then((newMessage) => {
            logger.log("WATCH: Fired alert message: ", {
              messageId: newMessage.id,
              result: res,
            });

            // Cache into the AlertCache for later
            //
            // If a user responds to a message that we have a cached alert for, stop watching it.
            WatchAlertMessageCache.cacheAlert(newMessage.id, res);
          })
          .catch((e) => {
            logger.error(e, "Error firing alert message: ", {
              result: res,
            });
          });
      }
    }
  });
};
