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

import { DateTime } from "luxon";
import { newLogger } from "../bot/logger";
import {
  messageHandlerHelpText,
  MessageHandlerOutput,
} from "../bot/message/MessageHandler";
import { Msg } from "../bot/message/Msg";
import { BotConfig } from "../config";
import { parseDate } from "../looper/DateParser";
import { WatchAlertMessageCache } from "../looper/WatchAlertMessageCache";
import { MagicKeyType } from "./model/MagicKeyType";
import {
  outputDateErrorText,
  outputDateMissingText,
} from "./outputs/dateerror";

const logger = newLogger("Commands");

export enum ParkCommandType {
  SHOW = "SHOW",
  WATCH = "WATCH",
  STOP = "STOP",
  CANCEL = "CANCEL",
  STATUS = "STATUS",
  HELP = "HELP",
  NONE = "",
}

export interface ParkCommand {
  isHelpCommand: boolean;
  type: ParkCommandType;

  magicKey: MagicKeyType;
  dates: string[];
}

const stringContentToArray = function (
  config: BotConfig,
  sliceOut: number,
  content: string
): ParkCommand {
  const { prefix } = config;
  // This is just the prefix
  if (content.split("").every((s) => s === prefix)) {
    return {
      isHelpCommand: true,
      type: ParkCommandType.NONE,
      magicKey: MagicKeyType.NONE,
      dates: [],
    };
  }

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // symbol = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = content.slice(sliceOut).trim().split(/\s+/g);

  // Shift out the first element, which is just the ${prefix}
  args.shift();

  // Type of command should be first, dates are the rest
  let rawType = args.shift();

  // No further command was passed, this is just the prefix
  if (!rawType) {
    return {
      isHelpCommand: true,
      type: ParkCommandType.NONE,
      magicKey: MagicKeyType.NONE,
      dates: [],
    };
  }

  let type = ParkCommandType.NONE;
  rawType = rawType.toUpperCase();
  if (rawType === ParkCommandType.SHOW) {
    type = ParkCommandType.SHOW;
  } else if (rawType === ParkCommandType.WATCH) {
    type = ParkCommandType.WATCH;
  } else if (rawType === ParkCommandType.STATUS) {
    type = ParkCommandType.STATUS;
  } else if (rawType === ParkCommandType.STOP) {
    type = ParkCommandType.STOP;
  } else if (rawType === ParkCommandType.CANCEL) {
    type = ParkCommandType.CANCEL;
  } else if (rawType === ParkCommandType.HELP) {
    type = ParkCommandType.HELP;
  }

  return {
    isHelpCommand:
      type === ParkCommandType.HELP || type === ParkCommandType.NONE,
    type,
    dates: args,

    // Magic key is hardcoded - change to take optional Key
    magicKey: MagicKeyType.INSPIRE,
  };
};

export const stringContentToParkCommand = function (
  config: BotConfig,
  content: string
): ParkCommand {
  const { isHelpCommand, type, dates, magicKey } = stringContentToArray(
    config,
    0,
    content
  );

  return {
    isHelpCommand:
      isHelpCommand ||
      type === ParkCommandType.NONE ||
      type === ParkCommandType.HELP,
    type,
    magicKey,
    dates,
  };
};

export const parseCommandDates = function (command: ParkCommand): {
  dateList: DateTime[];
  error: Promise<MessageHandlerOutput> | undefined;
} {
  const { dates } = command;

  const dateList: DateTime[] = [];
  for (const d of dates) {
    const parsedDate = parseDate(d);
    if (parsedDate) {
      dateList.push(parsedDate);
    } else {
      logger.warn("Failed to parse date string: ", d);
      return {
        dateList: [],
        error: Promise.resolve(messageHandlerHelpText(outputDateErrorText(d))),
      };
    }
  }

  if (dateList.length <= 0) {
    logger.warn("Need at least one date to watch");
    return {
      dateList: [],
      error: Promise.resolve(messageHandlerHelpText(outputDateMissingText())),
    };
  }

  return { dateList, error: undefined };
};

export const clearWatchOnReaction = function (message: Msg): boolean {
  const cachedAlert = WatchAlertMessageCache.getCachedAlert(message.id);
  logger.log("Cached Alert: ", cachedAlert);
  return !!cachedAlert;
};
