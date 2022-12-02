const { DateTime } = require("luxon");
const { bold } = require("../../util/format");

const PARK_LINK = `https://disneyland.disney.go.com/passes/blockout-dates/`;

function formatUserId(user) {
  return `<@!${user.id}>`;
}

function getStatus(calendar) {
  return bold(calendar.available ? "AVAILABLE" : "BLOCKED");
}

function formatDate(date) {
  return date.toLocaleString(DateTime.DATE_MED);
}

function error(message) {
  return `ERROR: ${message}`;
}

function parseCalendar(calendar, date) {
  // The spacing here is specific for the message formatting
  return `Spots are ${getStatus(calendar)} on ${formatDate(
    date
  )}. ${PARK_LINK}`.trim();
}

module.exports = {
  respond: function respond(user, message) {
    return `${formatUserId(user)}: ${message}`;
  },

  parkStatus: function parkStatus(user, calendar, date) {
    const content = parseCalendar(calendar, date);
    return this.respond(user, content);
  },

  confirm: function confirm(user, content) {
    return this.respond(user, `:thumbsup: ${content ? content : ""}`);
  },

  noMatchingDate: function noMatchingDate(user, date) {
    return this.respond(
      user,
      error(`No matching park calendar date found for ${formatDate(date)}`)
    );
  },

  missingDate: function missingDate(user) {
    return this.respond(
      user,
      error(`Could not check park calendar, date not recognized`)
    );
  },

  pastDay: function pastDay(user, date) {
    return this.respond(
      user,
      error(
        `Cannot lookup park availability for a date in the past: ${formatDate(
          date
        )}`
      )
    );
  },
};
