const Logger = require("../../logger");
const { DateTime } = require("luxon");

const logger = Logger.tag("bot/message/timeparser");

function parseDate(content) {
  try {
    let date = DateTime.fromISO(content);
    if (date.isValid) {
      return date;
    }

    logger.warn("Date not ISO format: ", content);
    date = DateTime.fromHTTP(content);
    if (date.isValid) {
      return date;
    }

    logger.warn("Date not HTTP format: ", content);
    date = DateTime.fromRFC2822(content);
    if (date.isValid) {
      return date;
    }

    logger.warn("Date not RFC format: ", content);
    date = DateTime.fromFormat(content, "MM/dd/yyyy");
    if (date.isValid) {
      return date;
    }

    logger.warn("Date not MM/dd/yyyy format: ", content);
    date = DateTime.fromFormat(content, "MM-dd-yyyy");
    if (date.isValid) {
      return date;
    }

    logger.warn("Date not MM-dd-yyyy format: ", content);
    date = DateTime.fromFormat(content, "MM dd yyyy");
    if (date.isValid) {
      return date;
    }

    logger.warn("Date not MM dd yyyy format: ", content);
    return null;
  } catch (e) {
    logger.error(e, "Unable to parse date: ", content);
    return null;
  }
}

module.exports = {
  parse: function parse(s) {
    let requestedDate = parseDate(s);

    // Clear times
    if (requestedDate) {
      requestedDate = requestedDate.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    }

    return requestedDate;
  },
};
