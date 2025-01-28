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

import { DateTime } from "luxon";
import { MagicKeyType } from "./MagicKeyType";
import { ParkCalendarResponse } from "./ParkCalendarResponse";
import { WatchEntry } from "./WatchEntry";

export interface BaseResult {
  magicKey: MagicKeyType;
  targetDate: DateTime;
  parkResponse: ParkCalendarResponse;
}

export interface LookupResult extends BaseResult {
  objectType: "LookupResult";
}

export interface WatchResult extends BaseResult {
  objectType: "WatchResult";
  userId: string;
  userName: string;
  messageId: string;
  channelId: string;
}

export const createLookupResult = function (
  magicKey: MagicKeyType,
  date: DateTime,
  response: ParkCalendarResponse,
): LookupResult {
  return {
    objectType: "LookupResult",

    magicKey: magicKey,
    targetDate: date,
    parkResponse: response,
  };
};

export const createResultFromEntry = function (
  entry: WatchEntry,
  response: ParkCalendarResponse,
): WatchResult {
  return {
    objectType: "WatchResult",
    userId: entry.userId,
    userName: entry.userName,
    messageId: entry.messageId,
    channelId: entry.channelId,

    magicKey: entry.magicKey,
    targetDate: entry.targetDate,

    parkResponse: response,
  };
};
