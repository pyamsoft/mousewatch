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
          if (!key) {
            continue;
          }

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
