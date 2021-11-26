const Responder = require("../responder");
const Formatter = require("../formatter");
const TimeParser = require("../timeparser");
const { DateTime } = require("luxon");
const Logger = require("../../../logger");
const Cache = require("./cache");
const Database = require("../../db");

const logger = Logger.tag("bot/message/handler/cancel");
const cache = Cache.getWatchCache();

function formatDate(date) {
  return date.toLocaleString(DateTime.DATE_MED);
}

function stopWatching(date, author, content) {
  if (date) {
    logger.log("Clear existing watch for date", formatDate(date));
    cache.remove(author, date);
  }

  if (date) {
    Database.removeWatch({
      userId: author.id,
      watchDateString: content,
    }).then((result) => {
      if (result) {
        logger.log("Cleared single db watch for user", {
          userId: author.id,
          watchDateString: content,
        });
      } else {
        logger.error("Failed clearing single db watch for user", {
          userId: author.id,
          watchDateString: content,
        });
      }
    });
  } else {
    Database.removeWatch({
      userId: author.id,
      watchDateString: null,
    }).then((result) => {
      if (result) {
        logger.log("Cleared all db watches for user", {
          userId: author.id,
        });
      } else {
        logger.error("Failed clearing all db watches for user", {
          userId: author.id,
        });
      }
    });
  }
}

module.exports = {
  cancel: function cancel({ message, content, oldMessage }) {
    const { author } = message;
    const requestedDate = TimeParser.parse(content);
    if (!requestedDate || !requestedDate.isValid) {
      const removed = cache.clear(author);
      logger.log("Clear all existing watches", removed);
      stopWatching(null, author, content);
    } else {
      const existingMessage = cache.get(author, requestedDate);
      if (existingMessage) {
        logger.log(
          "Clear targeted existing watches",
          formatDate(requestedDate)
        );
        stopWatching(requestedDate, existingMessage.author, content);
      }
    }

    return Responder.respond({
      oldMessage,
      message,
      post: Formatter.confirm(author),
    });
  },
};
