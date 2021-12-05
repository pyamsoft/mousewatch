const Logger = require("../../logger");
const Responder = require("./responder");
const Commands = require("./handler");

const logger = Logger.tag("bot/message/requesthandler");

function extractCommand(content) {
  const list = content.split(/\s+/);
  const [command, ...rest] = list;
  return [command.toLowerCase(), rest.join(" ")];
}

module.exports = {
  handle: function handle({ oldMessage, message, prefix }) {
    // First parse the message and remove our prefix
    const { content } = message;
    const cleanContentWithCommand = content.substring(prefix.length).trim();

    // Content is blank, show help
    if (!cleanContentWithCommand) {
      return Responder.help({
        oldMessage,
        message,
      });
    }

    const [command, args] = extractCommand(cleanContentWithCommand);
    switch (command) {
      case "show":
        return Commands.show({
          oldMessage,
          message,
          content: args,
        });
      case "watch":
        return Commands.watch({
          oldMessage,
          message,
          content: args,
          respond: true,
          addToDb: true,
        });
      case "cancel":
        return Commands.cancel({
          oldMessage,
          message,
          content: args,
        });
      case "status":
        return Commands.status({
          oldMessage,
          message,
        });
      default:
        logger.warn("Unknown command:", command);
        return Responder.help({
          oldMessage,
          message,
        });
    }
  },
};
