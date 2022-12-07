import { DateTime } from "luxon";
import { codeBlock } from "../../bot/discord/format";
import { KeyedObject } from "../../bot/model/KeyedObject";
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
    const statusBlocks: KeyedObject<MagicKeyPayload[]> = {};
    for (const magicKey of allMagicKeys()) {
      const entries = ParkWatchCache.magicKeyWatches(magicKey);
      const keyName = magicKeyName(magicKey);
      for (const entry of entries) {
        if (!statusBlocks[keyName]) {
          statusBlocks[keyName] = [];
        }

        const userBlock = statusBlocks[keyName].find(
          (b) => b.userId === entry.userId
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
`)
    );
  });
};
