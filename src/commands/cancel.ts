/*
 * Copyright 2023 pyamsoft
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
import { ParkCommand, ParkCommandType } from "./command";
import { outputClearFailed, outputClearWatch } from "./outputs/cancel";

const TAG = "CancelHandler";
const logger = newLogger(TAG);

export const CancelHandler = newMessageHandler(
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
      currentCommand.type !== ParkCommandType.CANCEL
    ) {
      return;
    }

    logger.log("Handle cancel message", currentCommand);
    const { magicKey } = currentCommand;

    return new Promise((resolve) => {
      const { author } = message;
      const userId = author.id;
      const userName = author.username;

      const outputs: KeyedObject<string> = {};
      if (ParkWatchCache.clearWatches(userId, magicKey)) {
        outputs[userId] = outputClearWatch(magicKey, userName);
      } else {
        outputs[userId] = outputClearFailed(magicKey, userName);
      }

      // If removing causes us no more watches, then stop the looper
      if (ParkWatchCache.targetCalendars().length <= 0) {
        ParkCalendarLookupLooper.stop();
      }

      resolve(messageHandlerOutput(outputs));
    });
  }
);
