const { DateTime } = require("luxon");
const { Timers } = require("../../../timer");
const { WATCH_INTERVAL } = require("../../constants");
const Cache = require("../cache");

function dateKey(date) {
  return date.toLocaleString(DateTime.DATE_MED);
}

function createWatchCache() {
  const cache = Cache.create();
  return {
    get: function get(author, date) {
      const authorCache = cache.get(author.id);
      if (!authorCache) {
        return null;
      }

      const cached = authorCache.get(dateKey(date));
      if (!cached) {
        return null;
      }

      return cached.message;
    },

    put: function put(message, date, callback) {
      const { author } = message;
      let authorCache = cache.get(author.id);
      if (!authorCache) {
        authorCache = Cache.create();
        cache.put(author.id, authorCache);
      }

      authorCache.put(dateKey(date), {
        author,
        message,
        callback: () => {
          Timers.clearInterval(callback);
        },
      });

      Timers.setInterval(callback, WATCH_INTERVAL);
    },

    remove: function remove(author, date) {
      const authorCache = cache.get(author.id);
      if (!authorCache) {
        return null;
      }
      const removed = authorCache.remove(dateKey(date));
      if (!removed) {
        return null;
      }

      removed.callback();
      return removed.message;
    },

    dates: function dates() {
      const result = {};
      for (const authorId of cache.keys()) {
        const authorCache = cache.get(authorId);
        if (!authorCache) {
          result[authorId] = {};
        } else {
          // Only return keys which are actively watching
          const payload = {};
          for (const key of authorCache.keys()) {
            const value = authorCache.get(key);
            if (value) {
              payload[key] = {
                author: value.author,
                message: value.message,
              };
            }
          }
          result[authorId] = payload;
        }
      }

      return result;
    },

    clear: function clear(author) {
      const authorCache = cache.get(author.id);
      if (!authorCache) {
        return [];
      }

      const all = authorCache.clear();
      const result = [];
      for (const r of all) {
        if (r) {
          result.push(r.message);
          r.callback();
        }
      }

      return result;
    },
  };
}

const cache = createWatchCache();
module.exports = {
  getWatchCache: function getWatchCache() {
    return cache;
  },
};
