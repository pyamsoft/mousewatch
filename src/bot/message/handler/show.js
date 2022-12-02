const Responder = require("../responder");
const Calendar = require("../../network/calendar");
const TimeParser = require("../timeparser");
const Formatter = require("../formatter");
const { isSameDay } = require("./calendar");
const { DateTime } = require("luxon");
const Logger = require("../../../logger");

const logger = Logger.tag("bot/message/handler/show");

module.exports = {
  show: function show({ message, oldMessage, content }) {
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

    return Calendar.dreamKey(true).then((calendar) => {
      logger.log("DREAM CALENDAR: ", calendar)
      const maybeMatching = calendar.find((c) =>
        isSameDay(c.date, requestedDate)
      );

      if (maybeMatching) {
        logger.log(
          "Does requested date have availability? : ",
          maybeMatching.json
        );
        return Responder.respond({
          oldMessage,
          message,
          post: Formatter.parkStatus(author, maybeMatching, requestedDate),
        });
      } else {
        return Responder.respond({
          oldMessage,
          message,
          post: Formatter.noMatchingDate(author, requestedDate),
        });
      }
    });
  },
};
