const isDebug = process.env.BOT_ENV !== "production";

function logTag(prefix) {
  return `<${prefix}>`;
}

function createLogger(prefix) {
  const logger = {
    print: function print(...args) {
      if (prefix) {
        console.log(logTag(prefix), ...args);
      } else {
        console.log(...args);
      }
    },

    log: function log(...args) {
      if (isDebug) {
        this.print(...args);
      }
    },

    warn: function warn(...args) {
      if (isDebug) {
        if (prefix) {
          console.warn(logTag(prefix), ...args);
        } else {
          console.warn(...args);
        }
      }
    },

    error: function error(e, ...args) {
      console.error(prefix, e, ...args);
    },
  };

  if (!prefix) {
    logger.tag = function tag(tag) {
      return createLogger(tag);
    };
  }

  return logger;
}

module.exports = createLogger(null);
