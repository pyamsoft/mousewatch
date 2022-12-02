const Logger = require("../../../logger");

const logger = Logger.tag("bot/message/handler/calendar");

module.exports = {
  isSameDay: function isSameDay(d1, d2) {
    if (!d1 || !d2) {
      logger.warn("Missing d1 d2", {
        d1,
        d2,
      });
      return false;
    }

    if (!d1.isValid || !d2.isValid) {
      logger.warn("Invalid d1 d2", {
        d1,
        d2,
      });
      return false;
    }

    // Day compare implies same month and year
    return d1.hasSame(d2, "day");
  },
};
