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
    dates: ReadonlyArray<DateTime>,
  ): Promise<ReadonlyArray<LookupResult>> {
    return new Promise((resolve, reject) => {
      const result: LookupResult[] = [];
      MagicKeyCalendarApi.getCalendar(magicKey)
        .then((response) => {
          for (const res of response) {
            for (const date of dates) {
              if (date.valueOf() === res.date.valueOf()) {
                result.push(createLookupResult(magicKey, date, res));
              }
            }
          }

          resolve(result);
        })
        .catch((e) => {
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
