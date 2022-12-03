import { MagicKeyType } from "../commands/model/MagicKeyType";
import { WatchEntry } from "../commands/model/WatchEntry";
import {
  createResultFromEntry,
  WatchResult,
} from "../commands/model/WatchResult";
import { MagicKeyCalendarApi } from "../network/magickeycalendar";
import { newLogger } from "../bot/logger";

const logger = newLogger("ParkCalendarLookupHandler");

export const ParkCalendarLookupHandler = {
  lookup: function (
    magicKey: MagicKeyType,
    entries: WatchEntry[]
  ): Promise<WatchResult[]> {
    return new Promise((resolve, reject) => {
      const result: WatchResult[] = [];
      MagicKeyCalendarApi.getCalendar(magicKey)
        .then((response) => {
          for (const res of response) {
            for (const entry of entries) {
              if (entry.targetDate == res.date) {
                result.push(createResultFromEntry(entry, res));
              }
            }
          }

          resolve(result);
        })
        .catch((e: any) => {
          logger.error(e, "Unable to lookup magic key calendar: ", {
            magicKey,
            entries,
          });
          reject(e);
        });
      return result;
    });
  },
};
