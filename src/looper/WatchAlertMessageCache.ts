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
    cache[messageId] = undefined;
  },
};
