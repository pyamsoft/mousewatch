import { DateTime } from "luxon";
import { newLogger } from "../bot/logger";
import {
  MessageHandler,
  messageHandlerHelpText,
  messageHandlerOutput,
} from "../bot/message/MessageHandler";
import { Msg } from "../bot/message/Msg";
import { KeyedObject } from "../bot/model/KeyedObject";
import { BotConfig } from "../config";
import { parseDate } from "../looper/DateParser";
import { ParkCalendarLookupHandler } from "../looper/ParkCalendarLooupHandler";
import { ParkCommand, ParkCommandType } from "./command";
import {
  outputParkAvailability,
  outputParkUnknown,
} from "./outputs/availability";
import { outputDateErrorText } from "./outputs/dateerror";

const TAG = "ShowHandler";
const logger = newLogger(TAG);

export const ShowHandler: MessageHandler = {
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
    // Only handle status
    const { currentCommand } = command;
    if (
      currentCommand.isHelpCommand ||
      currentCommand.type !== ParkCommandType.SHOW
    ) {
      return;
    }

    logger.log("Handle show message", currentCommand);
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
        for (const d of dateList) {
          const res = results.find((r) => d === r.targetDate);
          const key = d.toISO();
          if (res) {
            messages[key] = outputParkAvailability(undefined, res);
          } else {
            messages[key] = outputParkUnknown(magicKey, d);
          }
        }

        return messageHandlerOutput(messages);
      }
    );
  },
};
