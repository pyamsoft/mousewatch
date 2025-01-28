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
import { MagicKeyType } from "../commands/model/MagicKeyType";
import { WatchEntry } from "../commands/model/WatchEntry";

const cache = new Set<WatchEntry>();

const removeWatches = function (
  userId: string,
  magicKey: MagicKeyType,
  optionalDate: DateTime | undefined,
): boolean {
  const oldSize = cache.size;
  const deleteMe: WatchEntry[] = [];

  cache.forEach((e) => {
    if (e.userId === userId && e.magicKey === magicKey) {
      if (!optionalDate || optionalDate.valueOf() === e.targetDate.valueOf()) {
        deleteMe.push(e);
      }
    }
  });

  for (const d of deleteMe) {
    cache.delete(d);
  }

  return oldSize !== cache.size;
};

export const ParkWatchCache = {
  /**
   * Compile a list of the MagicKeys we need to watch
   */
  targetCalendars: function (): MagicKeyType[] {
    const magicKeys: MagicKeyType[] = [];

    cache.forEach((entry) => {
      if (!magicKeys.includes(entry.magicKey)) {
        magicKeys.push(entry.magicKey);
      }
    });

    return magicKeys;
  },

  magicKeyWatches: function (magicKey: MagicKeyType): WatchEntry[] {
    const entries: WatchEntry[] = [];

    cache.forEach((entry) => {
      if (entry.magicKey === magicKey) {
        entries.push(entry);
      }
    });

    return entries;
  },

  addWatch: function (entry: WatchEntry): boolean {
    let dupe = false;

    cache.forEach((e) => {
      if (
        e.userId === entry.userId &&
        e.magicKey === entry.magicKey &&
        e.targetDate.valueOf() === entry.targetDate.valueOf()
      ) {
        dupe = true;
      }
    });

    if (!dupe) {
      cache.add(entry);
    }

    return !dupe;
  },

  removeWatch: function (
    userId: string,
    magicKey: MagicKeyType,
    date: DateTime,
  ): boolean {
    return removeWatches(userId, magicKey, date);
  },

  clearWatches: function (userId: string, magicKey: MagicKeyType): boolean {
    return removeWatches(userId, magicKey, undefined);
  },
};
