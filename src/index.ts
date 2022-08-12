import { initializeBot } from "./bot";
import { sourceConfig } from "./config";
import { newLogger } from "./bot/logger";
import { MessageEventTypes } from "./bot/model/MessageEventType";
import { HelpHandler } from "./commands/help";
import { RestaurantDatabase } from "./db/RestaurantDatabase";

const logger = newLogger("MouseWatch");

const config = sourceConfig();
const bot = initializeBot(config);

const createHelpHandler = bot.addHandler(MessageEventTypes.CREATE, HelpHandler);
const updateHelpHandler = bot.addHandler(MessageEventTypes.UPDATE, HelpHandler);

const watcher = bot.watchMessages(() => {
  bot.removeHandler(createHelpHandler);
  bot.removeHandler(updateHelpHandler);
});

bot
  .login()
  .then((loggedIn) => {
    if (loggedIn) {
      logger.log("Bot logged in: ", loggedIn);
    } else {
      logger.warn("Bot failed to login!");
      watcher.stop();
    }
    return loggedIn;
  })
  .then((isLoggedIn) => {
    if (isLoggedIn) {
      logger.log("Restore DB when logged in");
      return RestaurantDatabase.restore(config);
    } else {
      logger.warn("Not logged in, do not restore DB");
      return;
    }
  });
