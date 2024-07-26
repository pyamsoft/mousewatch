/*
 * Copyright 2024 pyamsoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        if (!key) {
          continue;
        }

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
