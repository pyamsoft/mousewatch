const Logger = require("../../logger");
const { codeBlock } = require("../../util/format");
const { APP_NAME, VERSION } = require("../constants");
const Cache = require("./cache");
const Formatter = require("./formatter");

const cache = Cache.create();

const logger = Logger.tag("bot/message/responder");

const HELP_TEXT = codeBlock(`
${APP_NAME} [${VERSION}]

show <DATE>       - Shows the availability for the requested DATE
watch <DATE>      - Watch the calendar and notify the user when availability opens on DATE
cancel [DATE]     - Cancel any watches for DATE, or cancel all watches if no DATE supplied



NOTE:

<DATE> must be in format of either
MM/DD/YYYY, MM-DD-YYYY, MM DD YYYY, YYYY-MM-DD, LL DD YYYY
01/25/2022, 02-27-2021, 11 21 2021, 2021-07-16, Nov 11 2023
`);

function editMessage(post, oldMessage, message) {
  const cachedMessage = cache.get(oldMessage.id);
  if (!cachedMessage) {
    logger.warn("Could not find cached message: ", {
      post,
      oldMessage: {
        id: oldMessage.id,
        content: oldMessage.content,
      },
      message: { id: message.id, content: message.content },
    });
    postMessage(post, message);
    return;
  }

  cachedMessage
    .edit(post)
    .then((sent) => {
      cache.put(message.id, sent);
    })
    .catch((e) => {
      logger.error(e, "Failed to edit message: ", {
        oldMessage: {
          id: oldMessage.id,
          content: oldMessage.content,
        },
        message: { id: message.id, content: message.content },
        post,
      });
      cache.remove(message.id);
    });
}

function postMessage(post, message) {
  const { channel } = message;
  channel
    .send(post)
    .then((sent) => {
      cache.put(message.id, sent);
    })
    .catch((e) => {
      logger.error(e, "Failed to sent message: ", {
        message: { id: message.id, content: message.content },
        post,
      });
      cache.remove(message.id);
    });
}

function printHelp(message) {
  const { author } = message;
  return Formatter.respond(author, HELP_TEXT);
}

module.exports = {
  help: function help({ oldMessage, message }) {
    const helpPost = printHelp(message);
    if (oldMessage) {
      editMessage(helpPost, oldMessage, message);
    } else {
      postMessage(helpPost, message);
    }
  },
  respond: function respond({ oldMessage, message, post }) {
    if (oldMessage) {
      // If we have an old message, this is an update
      editMessage(post, oldMessage, message);
    } else {
      // Else its a new response
      postMessage(post, message);
    }
  },
};
