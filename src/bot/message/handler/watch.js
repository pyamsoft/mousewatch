const Responder = require("../responder");
const Calendar = require("../../network/calendar");
const TimeParser = require("../timeparser");
const Formatter = require("../formatter");
const { DateTime } = require("luxon");
const { isSameDay } = require("./calendar");
const Logger = require("../../../logger");
const Cache = require("./cache");

const logger = Logger.tag("bot/message/handler/watch");
const cache = Cache.getWatchCache();

function hasAvailability(maybeCalendar) {
  if (!maybeCalendar) {
    logger.warn("Missing lookup calendar result. Return no available.");
    return false;
  }

  return maybeCalendar.available;
}

// TODO Does one lookup per watch request
// Can we optimize this to do just one lookup always and then respond to every watch request?
function lookup({ author, oldMessage, message, requestedDate }) {
  return Calendar.dreamKey().then((calendar) => {
    const maybeMatching = calendar.find((c) =>
      isSameDay(c.date, requestedDate)
    );

    if (hasAvailability(maybeMatching)) {
      Responder.respond({
        oldMessage,
        message,
        post: Formatter.parkStatus(author, maybeMatching, requestedDate),
      });

      return true;
    } else {
      return false;
    }
  });
}

function formatDate(date) {
  return date.toLocaleString(DateTime.DATE_MED);
}

function stopWatching(date, message) {
  logger.log("Clear existing watch for date", formatDate(date));
  const { author } = message;
  cache.remove(author, date);
}

function beginWatching(date, message, callback) {
  logger.log("Begin watching date for availability", formatDate(date));
  cache.put(message, date, callback);
}

module.exports = {
  watch: function watch({ message, oldMessage, content }) {
    // DateTime.now() throws an error about not being a method?
    const today = DateTime.local().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const { author } = message;
    const requestedDate = TimeParser.parse(content);
    if (!requestedDate || !requestedDate.isValid) {
      return Responder.respond({
        oldMessage,
        message,
        post: Formatter.missingDate(author, requestedDate),
      });
    }

    if (requestedDate < today) {
      return Responder.respond({
        oldMessage,
        message,
        post: Formatter.pastDay(author, requestedDate),
      });
    }

    const existingMessage = cache.get(author, requestedDate);
    if (existingMessage) {
      stopWatching(requestedDate, existingMessage);
    }

    lookup({ author, oldMessage, message, requestedDate }).then((responded) => {
      if (!responded) {
        let found = false;
        beginWatching(requestedDate, message, () => {
          if (found) {
            logger.warn("Date has been found but callback still firing.", {
              date: formatDate(requestedDate),
              key: message.id,
              author: author.id,
            });
            return;
          }

          logger.log(
            "Again lookup date for availability",
            formatDate(requestedDate)
          );
          lookup({ author, oldMessage, message, requestedDate }).then((res) => {
            if (res) {
              found = true;
              stopWatching(requestedDate, message);
            }
          });
        });
      } else {
        logger.log(
          "Don't need to watch date, found availability",
          formatDate(requestedDate)
        );
      }
    });

    return Responder.respond({
      oldMessage,
      message,
      post: Formatter.confirm(author),
    });
  },
};
