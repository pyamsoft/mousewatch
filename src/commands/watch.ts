/*
 * Copyright 2025 pyamsoft
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
  messageHandlerOutput,
  newMessageHandler,
} from "../bot/message/MessageHandler";
import {
  messageFromMsg,
  Msg,
  sendChannelFromMessage,
} from "../bot/message/Msg";
import { BotConfig } from "../config";
import { ParkCalendarLookupLooper } from "../looper/ParkCalendarLookupLooper";
import { ParkCalendarLookupHandler } from "../looper/ParkCalendarLooupHandler";
import { ParkWatchCache } from "../looper/ParkWatchCache";
import { WatchAlertMessageCache } from "../looper/WatchAlertMessageCache";
import { ParkCommand, ParkCommandType, parseCommandDates } from "./command";
import { watchEntryFromMessage } from "./model/WatchEntry";
import { outputParkAvailability } from "./outputs/availability";
import { outputWatchStarted } from "./outputs/watch";
import { WatchResult } from "./model/WatchResult";

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config: BotConfig,
    command: {
      currentCommand: ParkCommand;
      oldCommand?: ParkCommand;
      message: Msg;
    },
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
        const messages: Record<string, string> = {};
        const notFoundDates: DateTime[] = [];

        for (const d of dateList) {
          const res = results.find(
            (r) => d.valueOf() === r.targetDate.valueOf(),
          );
          const key = d.toISO();
          if (!key) {
            continue;
          }

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
              }),
            );
          }
        }

        if (notFoundDates.length > 0) {
          sideEffectWatchLoop(message);
        }

        return messageHandlerOutput(messages);
      },
    );
  },
);

const alreadySeenResult = function (r1: WatchResult, r2: WatchResult): boolean {
  // If channels don't match, then maybe new
  if (r1.channelId !== r2.channelId) {
    return false;
  }

  // If messages don't match, then maybe new
  if (r1.messageId !== r2.messageId) {
    return false;
  }

  // If users don't match, then maybe new
  if (r1.userId !== r2.userId) {
    return false;
  }

  // If key types don't match, then maybe new
  if (r1.magicKey !== r2.magicKey) {
    return false;
  }

  // If we have seen the exact same date already, then we have seen this
  return r1.targetDate.valueOf() === r2.targetDate.valueOf();
};

const sideEffectWatchLoop = function (message: Msg) {
  const discordMsg = messageFromMsg(message);
  const sender = sendChannelFromMessage(discordMsg);

  ParkCalendarLookupLooper.loop((results) => {
    // For some reason, a single watch fires like 5 messages out.
    // We try to avoid this mass spam by de-duping at the sending point
    const avoidMassSpamBug: WatchResult[] = [];

    for (const res of results) {
      if (!res.parkResponse.available) {
        continue;
      }

      // If we have already sent this message before, do not send it again
      const alreadySent = avoidMassSpamBug.find((s) =>
        alreadySeenResult(s, res),
      );
      if (alreadySent) {
        logger.warn("[BUG]: We have already sent this Result!", res);
        continue;
      } else {
        avoidMassSpamBug.push(res);
      }

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
  });
};
