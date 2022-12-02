import { WatchEntry } from "../commands/model/WatchEntry";
import { DateTime } from "luxon";
import { MagicKeyType } from "../commands/model/MagicKeyType";

const cache = new Set<WatchEntry>();

const removeWatches = function (
  userId: string,
  optionalDate: DateTime | undefined
) {
  const deleteMe: WatchEntry[] = [];

  cache.forEach((e) => {
    if (e.userId === userId) {
      if (!optionalDate || optionalDate === e.targetDate) {
        deleteMe.push(e);
      }
    }
  });

  for (const d of deleteMe) {
    cache.delete(d);
  }
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

  addWatch: function (entry: WatchEntry) {
    let dupe = false;

    cache.forEach((e) => {
      if (
        e.userId === entry.userId &&
        e.magicKey === entry.magicKey &&
        e.targetDate === entry.targetDate
      ) {
        dupe = true;
      }
    });

    if (!dupe) {
      cache.add(entry);
    }
  },

  removeWatch: function (userId: string, date: DateTime) {
    removeWatches(userId, date);
  },

  clearWatches: function (userId: string) {
    removeWatches(userId, undefined);
  },
};
