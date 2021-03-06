const Logger = require("../logger");
const Status = require("./model/status");
const EventEmitter = require("./eventemitter");
const RequestHandler = require("./message/requesthandler");
const { Client } = require("../client");
const Database = require("./db");
const Restore = require("./restore");

const logger = Logger.tag("bot/index");

function validateMessage(
  prefix,
  { id, author, content },
  channel,
  optionalSpecificChannel
) {
  if (!id) {
    return false;
  }

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (author.bot) {
    return false;
  }

  // Missing channel
  if (!channel) {
    return false;
  }

  // Make sure the message has a text channel or a direct message
  if (channel.type !== "text" && channel.type !== "dm") {
    return false;
  }

  // If the bot only watches specific channels, make sure we enforce it here.
  if (optionalSpecificChannel) {
    if (channel.id !== optionalSpecificChannel) {
      return false;
    }
  }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  return content.startsWith(prefix);
}

function onDatabaseRestored(rows) {
  if (rows.length <= 0) {
    return;
  }

  Restore.restoreWatches(rows)
    .then(() => {
      logger.log("Restored all valid watches");
    })
    .catch((e) => {
      logger.error(e, "Failed to restore watches");
    });
}

function botWatchReady(emitter, { status }) {
  emitter.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    logger.print(`Bot has started!`);

    Database.getWatches().then(onDatabaseRestored);
  });

  emitter.on("error", (error) => {
    logger.error(error, "Bot has encountered an error!");
    status.setActivity("WEE WOO ERROR");

    Database.shutdown();
    // TODO clear watchers
  });
}

function spaceOutMessageLogs() {
  logger.log();
  logger.log();
  logger.log("=============");
}

function botWatchMessageUpdates(emitter, prefix, { specificChannel }) {
  logger.log("Watching for message updates");
  emitter.on("messageUpdate", (oldMessage, newMessage) => {
    const { channel } = newMessage;
    if (!validateMessage(prefix, newMessage, channel, specificChannel)) {
      return;
    }

    spaceOutMessageLogs();
    RequestHandler.handle({
      prefix,
      oldMessage,
      message: newMessage,
    });
  });
}

function botWatchMessages(emitter, prefix, { specificChannel }) {
  logger.log("Watching for messages");
  emitter.on("message", (message) => {
    const { channel } = message;

    // This event will run on every single message received, from any channel or DM.
    if (!validateMessage(prefix, message, channel, specificChannel)) {
      return;
    }

    spaceOutMessageLogs();
    RequestHandler.handle({
      prefix,
      oldMessage: null,
      message,
    });
  });
}

function initializeBot(prefix, { specificChannel }) {
  // Models
  const emitter = EventEmitter.create(Client);
  const status = Status.create(Client);

  // Event listeners
  botWatchReady(emitter, { status });
  botWatchMessages(emitter, prefix, { specificChannel });
  botWatchMessageUpdates(emitter, prefix, { specificChannel });

  // Login
  return function loginBot(token) {
    Client.login(token);
  };
}

function printEnv(config) {
  logger.print(`Starting bot...`);
  logger.print(`Responds to: '${config.prefix}'`);
  config.token
    ? logger.print(`Has authentication token`)
    : logger.error(`Missing authentication token!!`);
  logger.print();
}

// Log the bot in
module.exports = {
  login: function login(config) {
    printEnv(config);
    const { prefix, token, ...rest } = config;
    const loginBot = initializeBot(prefix, rest);
    loginBot(token);
  },
};
