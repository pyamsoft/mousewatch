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
import { Msg } from "../../bot/message/Msg";
import { MagicKeyType } from "./MagicKeyType";

export interface WatchEntry {
  objectType: "WatchEntry";

  userId: string;
  userName: string;
  messageId: string;
  channelId: string;

  // Info
  magicKey: MagicKeyType;
  targetDate: DateTime;
}

export const createWatchEntry = function (data: {
  userId: string;
  userName: string;
  messageId: string;
  channelId: string;

  // Info
  magicKey: MagicKeyType;
  targetDate: DateTime;
}): WatchEntry {
  return {
    objectType: "WatchEntry",
    ...data,
  };
};

export const watchEntryFromMessage = function (data: {
  message: Msg;
  magicKey: MagicKeyType;
  targetDate: DateTime;
}): WatchEntry {
  const { message, ...rest } = data;
  return createWatchEntry({
    ...rest,
    userId: message.author.id,
    userName: message.author.username,
    messageId: message.id,
    channelId: message.channel.id,
  });
};
