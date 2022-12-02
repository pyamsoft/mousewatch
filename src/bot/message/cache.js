const Logger = require("../../logger");

const logger = Logger.tag("bot/message/cache");

module.exports = {
  create: function create() {
    let cache = {};

    return {
      get: function get(id) {
        return cache[id];
      },

      put: function put(id, message) {
        cache[id] = message;
      },

      remove: function remove(id) {
        const old = cache[id];
        cache[id] = null;
        return old;
      },

      clear: function clear() {
        const old = Object.values(cache);
        cache = {};

        // Remove nulls
        return old.filter((v) => v);
      },

      keys: function keys() {
        // Remove nulls
        return Object.keys(cache).filter((k) => k);
      },

      log: function log() {
        for (const key of this.keys()) {
          const value = cache[key];
          logger.log("KEY: ", key);
          logger.log("VALUE: ", value);
          logger.log();
        }
      },
    };
  },
};
