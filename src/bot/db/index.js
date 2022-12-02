const Logger = require("../../logger");

const logger = Logger.tag("db/index");

let watches = [];

module.exports = {
  getWatches: async function getWatches() {
    return watches.map((w) => {
      return {
        ...w,
        user_id: w.userId,
        user_name: w.userName,
        message_id: w.messageId,
        channel_id: w.channelId,
        watch_date: w.watchDateString,
      };
    });
  },

  markWatchInvalid: async function markWatchInvalid({
    userId,
    userName,
    messageId,
    channelId,
    watchDateString,
  }) {
    const existing = watches.find((w) => {
      return (
        w.userId === userId &&
        w.userName === userName &&
        w.messageId === messageId &&
        w.channelId === channelId &&
        w.watchDateString === watchDateString
      );
    });

    if (existing) {
      existing.valid = false;
      logger.log("Mark watch invalid: ", existing);
      return true;
    } else {
      logger.warn("Could not find matching watch for data", {
        userId,
        userName,
        messageId,
        channelId,
        watchDateString,
      });
      return false;
    }
  },

  addWatch: async function addWatch({
    userId,
    userName,
    messageId,
    channelId,
    watchDateString,
  }) {
    logger.log("Add new watch", {
      userId,
      userName,
      messageId,
      channelId,
      watchDateString,
      valid: true,
    });
    watches.push({
      userId,
      userName,
      messageId,
      channelId,
      watchDateString,
      valid: true,
    });
    return true;
  },

  removeWatch: async function removeWatch({ userId, watchDateString }) {
    watches = watches.filter((w) => {
      if (watchDateString) {
        return w.userId !== userId && w.watchDateString !== watchDateString;
      } else {
        return w.userId !== userId;
      }
    });
    return true;
  },

  shutdown: function shutdown() {
    watches = [];
  },
};
