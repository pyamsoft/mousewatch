import { newLogger } from "../bot/logger";
import {
  messageHandlerOutput,
  newMessageHandler,
} from "../bot/message/MessageHandler";
import { Msg } from "../bot/message/Msg";
import { KeyedObject } from "../bot/model/KeyedObject";
import { BotConfig } from "../config";
import { ParkCalendarLookupLooper } from "../looper/ParkCalendarLookupLooper";
import { ParkWatchCache } from "../looper/ParkWatchCache";
import { ParkCommand, ParkCommandType, parseCommandDates } from "./command";
import { outputCancelFailed, outputStopWatch } from "./outputs/cancel";

const TAG = "StopHandler";
const logger = newLogger(TAG);

export const StopHandler = newMessageHandler(
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
    const { currentCommand, message } = command;
    if (
      currentCommand.isHelpCommand ||
      currentCommand.type !== ParkCommandType.STOP
    ) {
      return;
    }

    logger.log("Handle stop message", currentCommand);
    const { magicKey } = currentCommand;
    const { dateList, error } = parseCommandDates(currentCommand);

    if (error) {
      return error;
    }

    return new Promise((resolve) => {
      const { author } = message;
      const userId = author.id;

      const outputs: KeyedObject<string> = {};
      for (const d of dateList) {
        const key = d.toISO();
        if (ParkWatchCache.removeWatch(userId, magicKey, d)) {
          outputs[key] = outputStopWatch(magicKey, d);
        } else {
          outputs[key] = outputCancelFailed(magicKey, d);
        }
      }

      // If removing causes us no more watches, then stop the looper
      if (ParkWatchCache.targetCalendars().length <= 0) {
        ParkCalendarLookupLooper.stop();
      }

      resolve(messageHandlerOutput(outputs));
    });
  }
);
