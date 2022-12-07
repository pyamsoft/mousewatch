import { newLogger } from "../bot/logger";
import {
  messageHandlerOutput,
  newMessageHandler,
} from "../bot/message/MessageHandler";
import { Msg } from "../bot/message/Msg";
import { KeyedObject } from "../bot/model/KeyedObject";
import { BotConfig } from "../config";
import { ParkCalendarLookupHandler } from "../looper/ParkCalendarLooupHandler";
import { ParkCommand, ParkCommandType, parseCommandDates } from "./command";
import {
  outputParkAvailability,
  outputParkUnknown,
} from "./outputs/availability";

const TAG = "ShowHandler";
const logger = newLogger(TAG);

export const ShowHandler = newMessageHandler(
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
    // Only handle status
    const { currentCommand } = command;
    if (
      currentCommand.isHelpCommand ||
      currentCommand.type !== ParkCommandType.SHOW
    ) {
      return;
    }

    logger.log("Handle show message", currentCommand);
    const { magicKey } = currentCommand;
    const { dateList, error } = parseCommandDates(currentCommand);

    if (error) {
      return error;
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
  }
);
