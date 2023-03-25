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

import { Msg } from "./Msg";
import { KeyedObject } from "../model/KeyedObject";
import { newLogger } from "../logger";

const logger = newLogger("MessageCache");
const DEFAULT_TIMEOUT = 2 * 60 * 60 * 1000;

export interface MessageCache {
  insert: (messageId: string, key: string, message: Msg) => void;

  get: (messageId: string, key: string) => Msg | undefined;

  getAll: (messageId: string) => KeyedObject<Msg>;

  remove: (messageId: string, key: string) => void;

  removeAll: (messageId: string) => void;
}

interface CachedMsg {
  msg: Msg;
  lastUsed: Date;
}

export const createMessageCache = function (
  timeout: number = DEFAULT_TIMEOUT
): MessageCache {
  const cache: KeyedObject<KeyedObject<CachedMsg | undefined> | undefined> = {};

  const invalidateCache = function () {
    const now = new Date();

    // Clear out any stale entries
    for (const id of Object.keys(cache)) {
      const oldData = cache[id];

      // Already cleared out
      if (!oldData) {
        continue;
      }

      for (const keyed of Object.keys(oldData)) {
        const checking = oldData[keyed];

        // Already cleared out
        if (!checking) {
          continue;
        }

        if (now.valueOf() - timeout > checking.lastUsed.valueOf()) {
          logger.log("Evicted old data from cache: ", {
            now,
            id,
            keyed,
            checking,
          });
          oldData[keyed] = undefined;
        }
      }
    }
  };

  const filterCached = function (
    cached: KeyedObject<CachedMsg | undefined>
  ): KeyedObject<Msg> {
    const cleaned: KeyedObject<Msg> = {};
    for (const key of Object.keys(cached)) {
      const data = cached[key];
      if (data) {
        cleaned[key] = data.msg;
      }
    }

    return cleaned;
  };

  const getAllForId = function (
    id: string
  ): KeyedObject<CachedMsg | undefined> {
    if (!id) {
      return {};
    }

    const cached = cache[id];
    if (!cached) {
      return {};
    }

    return cached;
  };

  return {
    get: function (messageId: string, key: string) {
      // Remove stale
      invalidateCache();

      const keyed = filterCached(getAllForId(messageId));
      return keyed[key] || undefined;
    },
    getAll: function (messageId: string) {
      // Remove stale
      invalidateCache();

      return filterCached(getAllForId(messageId));
    },
    insert: function (messageId: string, key: string, message: Msg) {
      if (!cache[messageId]) {
        cache[messageId] = {};
      }

      // We know this is truthy because of above
      const writeable = cache[messageId]!;

      writeable[key] = {
        msg: message,
        lastUsed: new Date(),
      };

      // Remove any stale
      invalidateCache();
    },
    remove: function (messageId: string, key: string) {
      const keyed = getAllForId(messageId);
      keyed[key] = undefined;

      // Remove stale
      invalidateCache();
    },
    removeAll: function (messageId: string) {
      cache[messageId] = undefined;

      // Remove stale
      invalidateCache();
    },
  };
};
