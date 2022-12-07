import { DateTime } from "luxon";
import { newLogger } from "../bot/logger";
import {
  messageHandlerOutput,
  newMessageHandler,
} from "../bot/message/MessageHandler";
import {
  messageFromMsg,
  Msg,
  sendChannelFromMessage,
} from "../bot/message/Msg";
import { KeyedObject } from "../bot/model/KeyedObject";
import { BotConfig } from "../config";
import { ParkCalendarLookupLooper } from "../looper/ParkCalendarLookupLooper";
import { ParkCalendarLookupHandler } from "../looper/ParkCalendarLooupHandler";
import { ParkWatchCache } from "../looper/ParkWatchCache";
import { WatchAlertMessageCache } from "../looper/WatchAlertMessageCache";
import { ParkCommand, ParkCommandType, parseCommandDates } from "./command";
import { watchEntryFromMessage } from "./model/WatchEntry";
import { outputParkAvailability } from "./outputs/availability";
import { outputWatchStarted } from "./outputs/watch";

const TAG = "WatchHandler";
const logger = newLogger(TAG);

const cancelOldWatches = function (message: Msg, oldCommand: ParkCommand) {
  if (oldCommand.isHelpCommand || oldCommand.type !== ParkCommandType.WATCH) {
    return;
  }

  const { magicKey } = oldCommand;
  const { dateList, error } = parseCommandDates(oldCommand);
  if (error) {
    return;
  }

  const { author } = message;
  const userId = author.id;
  for (const date of dateList) {
    if (ParkWatchCache.removeWatch(userId, magicKey, date)) {
      logger.log("Remove stale watch: ", {
        userId,
        magicKey,
        date,
      });
    }
  }

  // If removing causes us no more watches, then stop the looper
  if (ParkWatchCache.targetCalendars().length <= 0) {
    ParkCalendarLookupLooper.stop();
  }
};

export const WatchHandler = newMessageHandler(
  TAG,
  function (
    // @ts-ignore
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
      message: Msg;
    }
  ) {
    const { currentCommand, oldCommand, message } = command;
    if (
      currentCommand.isHelpCommand ||
      currentCommand.type !== ParkCommandType.WATCH
    ) {
      return;
    }

    if (oldCommand) {
      // Cancel any old watches
      cancelOldWatches(message, oldCommand);
    }

    logger.log("Handle watch message", currentCommand);
    const { magicKey } = currentCommand;
    const { dateList, error } = parseCommandDates(currentCommand);

    if (error) {
      return error;
    }

    return ParkCalendarLookupHandler.lookup(magicKey, dateList).then(
      (results) => {
        const messages: KeyedObject<string> = {};
        const notFoundDates: DateTime[] = [];

        for (const d of dateList) {
          const res = results.find(
            (r) => d.valueOf() === r.targetDate.valueOf()
          );
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
          sideEffectWatchLoop(message);
        }

        return messageHandlerOutput(messages);
      }
    );
  }
);

const sideEffectWatchLoop = function (message: Msg) {
  const discordMsg = messageFromMsg(message);
  const sender = sendChannelFromMessage(discordMsg);

  ParkCalendarLookupLooper.loop((results) => {
    for (const res of results) {
      if (res.parkResponse.available) {
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
