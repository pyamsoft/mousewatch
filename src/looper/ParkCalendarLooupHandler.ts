import { DateTime } from "luxon";
import { newLogger } from "../bot/logger";
import { MagicKeyType } from "../commands/model/MagicKeyType";
import {
  createLookupResult,
  LookupResult,
} from "../commands/model/WatchResult";
import { MagicKeyCalendarApi } from "../network/magickeycalendar";

const logger = newLogger("ParkCalendarLookupHandler");

export const ParkCalendarLookupHandler = {
  lookup: function (
    magicKey: MagicKeyType,
    dates: DateTime[]
  ): Promise<LookupResult[]> {
    return new Promise((resolve, reject) => {
      const result: LookupResult[] = [];
      MagicKeyCalendarApi.getCalendar(magicKey)
        .then((response) => {
          for (const res of response) {
            for (const date of dates) {
              if (date == res.date) {
                result.push(createLookupResult(magicKey, date, res));
              }
            }
          }

          resolve(result);
        })
        .catch((e: any) => {
          logger.error(e, "Unable to lookup magic key calendar: ", {
            magicKey,
            dates,
          });
          reject(e);
        });
      return result;
    });
  },
};
