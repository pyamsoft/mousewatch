import { initializeBot } from "./bot";
import { sourceConfig } from "./config";
import { newLogger } from "./bot/logger";
import { MessageEventTypes } from "./bot/model/MessageEventType";
import { HelpHandler } from "./commands/help";
import { RestaurantDatabase } from "./db/RestaurantDatabase";
import { watchAndNotifyRestaurantAvailability } from "./bot/service/RestaurantService";
import { RestaurantLooper } from "./looper/RestaurantLooper";

const logger = newLogger("MouseWatch");

const config = sourceConfig();
const bot = initializeBot(config);

const createHelpHandler = bot.addHandler(MessageEventTypes.CREATE, HelpHandler);
const updateHelpHandler = bot.addHandler(MessageEventTypes.UPDATE, HelpHandler);

const watcher = bot.watchMessages(() => {
  logger.log("Teardown bot");

  // Unregister listeners
  bot.removeHandler(createHelpHandler);
  bot.removeHandler(updateHelpHandler);

  // Shutdown looper
  RestaurantLooper.shutdown();
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
  .then(async (isLoggedIn) => {
    if (isLoggedIn) {
      logger.log("Restore DB when logged in");
      await RestaurantDatabase.init(config);

      // Restore restaurant
      const result = await RestaurantDatabase.getAllRestaurants(config);
      const restaurants = result.data;
      if (restaurants) {
        watchAndNotifyRestaurantAvailability(restaurants);
      }
    } else {
      logger.warn("Not logged in, do not restore DB");
      return;
    }
  });
