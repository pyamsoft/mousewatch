import { KeyedObject } from "../bot/model/KeyedObject";
import { WatchResult } from "../commands/model/WatchResult";

const cache: KeyedObject<WatchResult | undefined> = {};

export const WatchAlertMessageCache = {
  cacheAlert: function (messageId: string, result: WatchResult) {
    cache[messageId] = result;
  },

  getCachedAlert: function (messageId: string): WatchResult | undefined {
    return cache[messageId];
  },

  removeCachedAlert: function (messageId: string) {
    const cached = cache[messageId];
    cache[messageId] = undefined;

    // If we have removed a cached message for a result, go through the cache and remove all other results that
    // look like it
    if (cached) {
      const removeOthers: string[] = [];
      for (const key of Object.keys(cached)) {
        const value = cache[key];
        if (value) {
          if (
            value.userId === cached.userId &&
            value.magicKey === cached.magicKey &&
            value.targetDate.valueOf() === cached.targetDate.valueOf()
          ) {
            removeOthers.push(key);
          }
        }
      }

      for (const removeKey of removeOthers) {
        cache[removeKey] = undefined;
      }
    }
  },
};
