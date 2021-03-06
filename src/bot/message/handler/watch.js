const Responder = require("../responder");
const Calendar = require("../../network/calendar");
const TimeParser = require("../timeparser");
const Formatter = require("../formatter");
const { DateTime } = require("luxon");
const { isSameDay } = require("./calendar");
const Logger = require("../../../logger");
const Cache = require("./cache");
const Database = require("../../db");

const logger = Logger.tag("bot/message/handler/watch");
const cache = Cache.getWatchCache();

function hasAvailability(maybeCalendar) {
  if (!maybeCalendar) {
    logger.warn("Missing lookup calendar result. Return no available.");
    return false;
  }

  logger.log("Does requested date have availability? : ", maybeCalendar.json);
  return maybeCalendar.available;
}

// TODO Does one lookup per watch request
// Can we optimize this to do just one lookup always and then respond to every watch request?
function lookup({ author, oldMessage, message, requestedDate }) {
  return Calendar.dreamKey(false).then((calendar) => {
    logger.log(
      "Calendar availability for watch: ",
      calendar.map((c) => {
        const { date, ...rest } = c;
        return {
          ...rest,
          date: formatDate(date),
        };
      })
    );
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

function stopWatching(date, message, content) {
  logger.log("Clear existing watch for date", formatDate(date));
  const { author, channel } = message;
  cache.remove(author, date);

  Database.markWatchInvalid({
    userId: author.id,
    userName: author.username,
    messageId: message.id,
    channelId: channel.id,
    watchDateString: content,
  }).then((result) => {
    if (result) {
      logger.log("Invalidate watch from DB: ", {
        userId: author.id,
        userName: author.username,
        messageId: message.id,
        channelId: channel.id,
        watchDateString: content,
      });
    } else {
      logger.warn("Failed invalidating watch from DB: ", {
        userId: author.id,
        userName: author.username,
        messageId: message.id,
        channelId: channel.id,
        watchDateString: content,
      });
    }
  });
}

function beginWatching(date, message, content, addToDb, callback) {
  logger.log("Begin watching date for availability", formatDate(date));
  cache.put(message, date, callback);

  const { author, channel } = message;
  if (!addToDb) {
    return;
  }

  Database.addWatch({
    userId: author.id,
    userName: author.username,
    messageId: message.id,
    channelId: channel.id,
    watchDateString: content,
  }).then((result) => {
    if (result) {
      logger.log("Added watch to DB: ", {
        userId: author.id,
        userName: author.username,
        messageId: message.id,
        channelId: channel.id,
        watchDateString: content,
      });
    } else {
      logger.warn("Failed adding watch to DB: ", {
        userId: author.id,
        userName: author.username,
        messageId: message.id,
        channelId: channel.id,
        watchDateString: content,
      });
    }
  });
}

module.exports = {
  watch: function watch({ message, oldMessage, content, respond, addToDb }) {
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
      if (!respond) {
        logger.warn("Requested date is invalid, but NO_RESPOND is set");
        return;
      }
      return Responder.respond({
        oldMessage,
        message,
        post: Formatter.missingDate(author, requestedDate),
      });
    }

    if (requestedDate < today) {
      stopWatching(requestedDate, message, content);

      if (!respond) {
        logger.warn("Requested date is before today, but NO_RESPOND is set");
        return;
      }

      return Responder.respond({
        oldMessage,
        message,
        post: Formatter.pastDay(author, requestedDate),
      });
    }

    const existingMessage = cache.get(author, requestedDate);
    if (existingMessage) {
      stopWatching(requestedDate, existingMessage, content);
    }

    lookup({ author, oldMessage, message, requestedDate }).then((responded) => {
      if (!responded) {
        let found = false;
        beginWatching(requestedDate, message, content, addToDb, () => {
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
              stopWatching(requestedDate, message, content);
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

    if (!respond) {
      logger.warn("NO_RESPOND is set");
      return;
    }

    const post = Formatter.confirm(
      author,
      `Watching date: ${formatDate(requestedDate)}`
    );
    logger.log("Attempt response: ", {
      oldMessage,
      message,
      post,
    });
    return Responder.respond({
      oldMessage,
      message,
      post,
    });
  },
};
