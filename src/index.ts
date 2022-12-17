import { initializeBot } from "./bot";
import { newLogger } from "./bot/logger";
import { MessageEventTypes } from "./bot/model/MessageEventType";
import { CancelHandler } from "./commands/cancel";
import { HelpHandler } from "./commands/help";
import { ShowHandler } from "./commands/show";
import { StatusHandler } from "./commands/status";
import { StopHandler } from "./commands/stop";
import { WatchHandler } from "./commands/watch";
import { sourceConfig } from "./config";
import { registerPeriodicHealthCheck } from "./health";
import { ReactionStopWatchHandler } from "./reactions/stopwatch";

const logger = newLogger("MouseWatch");

const main = function () {
  const config = sourceConfig();
  const bot = initializeBot(config);

  const createHelpHandler = bot.addHandler(
    MessageEventTypes.CREATE,
    HelpHandler
  );
  const updateHelpHandler = bot.addHandler(
    MessageEventTypes.UPDATE,
    HelpHandler
  );

  const createStatusHandler = bot.addHandler(
    MessageEventTypes.CREATE,
    StatusHandler
  );
  const updateStatusHandler = bot.addHandler(
    MessageEventTypes.UPDATE,
    StatusHandler
  );

  const createShowHandler = bot.addHandler(
    MessageEventTypes.CREATE,
    ShowHandler
  );
  const updateShowHandler = bot.addHandler(
    MessageEventTypes.UPDATE,
    ShowHandler
  );

  const createWatchHandler = bot.addHandler(
    MessageEventTypes.CREATE,
    WatchHandler
  );
  const updateWatchHandler = bot.addHandler(
    MessageEventTypes.UPDATE,
    WatchHandler
  );

  const createStopHandler = bot.addHandler(
    MessageEventTypes.CREATE,
    StopHandler
  );
  const updateStopHandler = bot.addHandler(
    MessageEventTypes.UPDATE,
    StopHandler
  );

  const createCancelHandler = bot.addHandler(
    MessageEventTypes.CREATE,
    CancelHandler
  );
  const updateCancelHandler = bot.addHandler(
    MessageEventTypes.UPDATE,
    CancelHandler
  );

  const stopWatchReactionHandler = bot.addHandler(
    MessageEventTypes.REACTION,
    ReactionStopWatchHandler
  );

  const health = registerPeriodicHealthCheck(config.healthCheckUrl);

  const watcher = bot.watchMessages(() => {
    health.unregister();

    bot.removeHandler(createHelpHandler);
    bot.removeHandler(updateHelpHandler);

    bot.removeHandler(createStatusHandler);
    bot.removeHandler(updateStatusHandler);

    bot.removeHandler(createShowHandler);
    bot.removeHandler(updateShowHandler);

    bot.removeHandler(createWatchHandler);
    bot.removeHandler(updateWatchHandler);

    bot.removeHandler(createStopHandler);
    bot.removeHandler(updateStopHandler);

    bot.removeHandler(createCancelHandler);
    bot.removeHandler(updateCancelHandler);

    bot.removeHandler(stopWatchReactionHandler);
  });

  bot.login().then((loggedIn) => {
    if (loggedIn) {
      logger.log("Bot logged in: ", loggedIn);
    } else {
      logger.warn("Bot failed to login!");
      watcher.stop();
    }
  });
};

main();
