import { initializeBot } from "./bot";
import { newLogger } from "./bot/logger";
import { MessageEventTypes } from "./bot/model/MessageEventType";
import { HelpHandler } from "./commands/help";
import { ShowHandler } from "./commands/show";
import { StatusHandler } from "./commands/status";
import { sourceConfig } from "./config";

const logger = newLogger("MouseWatch");

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

const createShowHandler = bot.addHandler(MessageEventTypes.CREATE, ShowHandler);
const updateShowHandler = bot.addHandler(MessageEventTypes.UPDATE, ShowHandler);

const watcher = bot.watchMessages(() => {
  bot.removeHandler(createHelpHandler);
  bot.removeHandler(updateHelpHandler);

  bot.removeHandler(createStatusHandler);
  bot.removeHandler(updateStatusHandler);

  bot.removeHandler(createShowHandler);
  bot.removeHandler(updateShowHandler);
});

bot.login().then((loggedIn) => {
  if (loggedIn) {
    logger.log("Bot logged in: ", loggedIn);
  } else {
    logger.warn("Bot failed to login!");
    watcher.stop();
  }
});
