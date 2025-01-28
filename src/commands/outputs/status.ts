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
import { codeBlock } from "../../bot/discord/format";
import { BotConfig } from "../../config";
import { ParkWatchCache } from "../../looper/ParkWatchCache";
import { allMagicKeys, magicKeyName } from "../model/MagicKeyType";

interface MagicKeyPayload {
  userId: string;
  userName: string;
  dates: DateTime[];
}

export const outputStatusText = function (config: BotConfig): Promise<string> {
  const { prefix } = config;

  return new Promise((resolve) => {
    const statusBlocks: Record<string, MagicKeyPayload[]> = {};
    for (const magicKey of allMagicKeys()) {
      const entries = ParkWatchCache.magicKeyWatches(magicKey);
      const keyName = magicKeyName(magicKey);
      for (const entry of entries) {
        if (!statusBlocks[keyName]) {
          statusBlocks[keyName] = [];
        }

        const userBlock = statusBlocks[keyName].find(
          (b) => b.userId === entry.userId,
        );
        if (userBlock) {
          userBlock.dates.push(entry.targetDate);
        } else {
          statusBlocks[keyName].push({
            userId: entry.userId,
            userName: entry.userName,
            dates: [entry.targetDate],
          });
        }
      }
    }

    let textBlock = "";
    const keyList = Object.keys(statusBlocks);
    if (keyList.length <= 0) {
      textBlock = "No active Watch loops";
    } else {
      for (const keyName of keyList) {
        const userBlocks = statusBlocks[keyName];
        textBlock += `${keyName}\n`;
        for (const block of userBlocks) {
          textBlock += `    ${block.userName}: ${block.dates
            // Use DATE_SHORT so user knows the format we expect
            .map((d) => d.toLocaleString(DateTime.DATE_SHORT))
            .join(", ")}`;
        }
        textBlock += `\n\n`;
      }
    }

    resolve(
      codeBlock(`
COMMAND: ${prefix}
===========================
${textBlock.trim()}
`),
    );
  });
};
