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
import { bold, italic } from "../../bot/discord/format";
import { magicKeyName, MagicKeyType } from "../model/MagicKeyType";

export const outputStopWatch = function (
  magicKey: MagicKeyType,
  date: DateTime,
): string {
  return `:negative_squared_cross_mark: Stopped watching ${italic(
    magicKeyName(magicKey),
  )} reservations on ${bold(
    date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
  )}`;
};

export const outputClearWatch = function (
  magicKey: MagicKeyType,
  userName: string,
): string {
  return `:negative_squared_cross_mark: Stopped watching ${italic(
    magicKeyName(magicKey),
  )} reservations for ${userName}`;
};

export const outputCancelFailed = function (
  magicKey: MagicKeyType,
  date: DateTime,
): string {
  return `:x: Unable to stop watching ${italic(
    magicKeyName(magicKey),
  )} reservations on ${bold(
    date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
  )}`;
};

export const outputClearFailed = function (
  magicKey: MagicKeyType,
  userName: string,
): string {
  return `:x: Unable to stop watching ${italic(
    magicKeyName(magicKey),
  )} reservations for ${userName}`;
};
