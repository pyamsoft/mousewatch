import { initializeBot } from "./bot";
import { sourceConfig } from "./config";
import { newLogger } from "./bot/logger";
import { HelpHandler } from "./commands/help";
import { MessageEventTypes } from "./bot/model/MessageEventType";
import { StatusHandler } from "./commands/status";

const logger = newLogger("StonkBot");

const config = sourceConfig();
const bot = initializeBot(config);

const createHelpHandler = bot.addHandler(MessageEventTypes.CREATE, HelpHandler);
const updateHelpHandler = bot.addHandler(MessageEventTypes.UPDATE, HelpHandler);

const createStatusHandler = bot.addHandler(
  MessageEventTypes.CREATE,
  StatusHandler
);
const updateStatusHandler = bot.addHandler(
  MessageEventTypes.UPDATE,
  StatusHandler
);

const watcher = bot.watchMessages(() => {
  bot.removeHandler(createHelpHandler);
  bot.removeHandler(updateHelpHandler);

  bot.removeHandler(createStatusHandler);
  bot.removeHandler(updateStatusHandler);
});

bot.login().then((loggedIn) => {
  if (loggedIn) {
    logger.log("Bot logged in: ", loggedIn);
  } else {
    logger.warn("Bot failed to login!");
    watcher.stop();
  }
});
