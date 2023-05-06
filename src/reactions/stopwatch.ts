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

import { MessageReaction, PartialMessageReaction } from "discord.js";
import { newLogger } from "../bot/logger";
import { newReactionHandler } from "../bot/message/MessageHandler";
import { reactionChannelFromMessage } from "../bot/message/Reaction";
import { BotConfig } from "../config";
import { ParkCalendarLookupLooper } from "../looper/ParkCalendarLookupLooper";
import { ParkWatchCache } from "../looper/ParkWatchCache";
import { WatchAlertMessageCache } from "../looper/WatchAlertMessageCache";

const TAG = "ReactionStopWatchHandler";
const logger = newLogger(TAG);

export const ReactionStopWatchHandler = newReactionHandler(
  TAG,

  function (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Unused but needed for function signature
    config: BotConfig,
    reaction: MessageReaction | PartialMessageReaction
  ) {
    const { message, emoji } = reaction;
    const targetMessageId = message.id;

    // If its a custom emoji, we need the id, otherwise the name as a unicode emoji works fine
    const emojiContent = emoji ? emoji.id || emoji.name : undefined;

    logger.log(
      "Reaction captured for message: ",
      targetMessageId,
      emojiContent
    );

    // See if we have sent the alert message
    const cachedAlert = WatchAlertMessageCache.getCachedAlert(targetMessageId);
    if (!cachedAlert) {
      logger.warn(
        "Can't handle reaction for a non-alert message",
        targetMessageId
      );
      return;
    }

    // We have, remove the watch and the alert
    WatchAlertMessageCache.removeCachedAlert(targetMessageId);

    // If we have removed the Watch, send a reaction to our own message using the same emoji
    if (
      ParkWatchCache.removeWatch(
        cachedAlert.userId,
        cachedAlert.magicKey,
        cachedAlert.targetDate
      )
    ) {
      logger.log("Reaction clears watch", {
        alert: cachedAlert,
        emoji,
      });

      // If removing causes us no more watches, then stop the looper
      if (ParkWatchCache.targetCalendars().length <= 0) {
        ParkCalendarLookupLooper.stop();
      }

      // Additional user feedback
      if (emojiContent) {
        reactionChannelFromMessage(message)
          .react(emojiContent)
          .then(() => {
            logger.log("Closed the loop with a reaction", emojiContent);
          })
          .catch((e) => {
            logger.error(
              e,
              "Error closing the loop with a reaction",
              emojiContent
            );
          });
      }
    }
  }
);
