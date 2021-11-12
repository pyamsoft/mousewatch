const Responder = require("../responder");
const Formatter = require("../formatter");
const TimeParser = require("../timeparser");
const { DateTime } = require("luxon");
const Logger = require("../../../logger");
const Cache = require("./cache");

const logger = Logger.tag("bot/message/handler/cancel");
const cache = Cache.getWatchCache();

function formatDate(date) {
  return date.toLocaleString(DateTime.DATE_MED);
}

function stopWatching(date, message) {
  logger.log("Clear existing watch for date", formatDate(date));
  const { author } = message;
  cache.remove(author, date);
}

module.exports = {
  cancel: function cancel({ message, content, oldMessage }) {
    const { author } = message;
    const requestedDate = TimeParser.parse(content);
    if (!requestedDate || !requestedDate.isValid) {
      const removed = cache.clear(author);
      logger.log("Clear all existing watches", removed);
    } else {
      const existingMessage = cache.get(author, requestedDate);
      if (existingMessage) {
        logger.log(
          "Clear targeted existing watches",
          formatDate(requestedDate)
        );
        stopWatching(requestedDate, existingMessage);
      }
    }

    return Responder.respond({
      oldMessage,
      message,
      post: Formatter.confirm(author),
    });
  },
};
