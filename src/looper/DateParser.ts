/*
 * Copyright 2024 pyamsoft
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

import { DateTime, SystemZone } from "luxon";
import { newLogger } from "../bot/logger";

const logger = newLogger("DateParser");

const options = { zone: SystemZone.instance };

const parseRawDate = function (content: string): DateTime | undefined {
  try {
    let date = DateTime.fromISO(content, options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromHTTP(content, options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromRFC2822(content, options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM/dd/yyyy", options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM-dd-yyyy", options);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM dd yyyy", options);
    if (date.isValid) {
      return date;
    }

    return undefined;
  } catch (e) {
    logger.error(e, "Unable to parse date: ", content);
    return undefined;
  }
};

export const parseDate = function (content: string): DateTime | undefined {
  const date = parseRawDate(content);
  if (!date) {
    return date;
  } else {
    return date.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
};
