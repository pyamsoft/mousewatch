const Logger = require("../../logger");
const { DateTime } = require("luxon");

const logger = Logger.tag("bot/message/timeparser");

function parseDate(content) {
  try {
    let date = DateTime.fromISO(content);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromHTTP(content);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromRFC2822(content);
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM/dd/yyyy");
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM-dd-yyyy");
    if (date.isValid) {
      return date;
    }

    date = DateTime.fromFormat(content, "MM dd yyyy");
    if (date.isValid) {
      return date;
    }

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
