import { initializeBot } from "./bot";
import { sourceConfig } from "./config";
import { newLogger } from "./bot/logger";
import { MessageEventTypes } from "./bot/model/MessageEventType";
import { HelpHandler } from "./commands/help";

const logger = newLogger("MouseWatch");

const config = sourceConfig();
const bot = initializeBot(config);

const createHelpHandler = bot.addHandler(MessageEventTypes.CREATE, HelpHandler);
const updateHelpHandler = bot.addHandler(MessageEventTypes.UPDATE, HelpHandler);

const watcher = bot.watchMessages(() => {
  bot.removeHandler(createHelpHandler);
  bot.removeHandler(updateHelpHandler);
});

bot.login().then((loggedIn) => {
  if (loggedIn) {
    logger.log("Bot logged in: ", loggedIn);
  } else {
    logger.warn("Bot failed to login!");
    watcher.stop();
  }
});
