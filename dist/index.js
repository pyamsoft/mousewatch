"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = require("./bot");
var config_1 = require("./config");
var logger_1 = require("./bot/logger");
var MessageEventType_1 = require("./bot/model/MessageEventType");
var help_1 = require("./commands/help");
var logger = (0, logger_1.newLogger)("MouseWatch");
var config = (0, config_1.sourceConfig)();
var bot = (0, bot_1.initializeBot)(config);
var createHelpHandler = bot.addHandler(MessageEventType_1.MessageEventTypes.CREATE, help_1.HelpHandler);
var updateHelpHandler = bot.addHandler(MessageEventType_1.MessageEventTypes.UPDATE, help_1.HelpHandler);
var watcher = bot.watchMessages(function () {
    bot.removeHandler(createHelpHandler);
    bot.removeHandler(updateHelpHandler);
});
bot.login().then(function (loggedIn) {
    if (loggedIn) {
        logger.log("Bot logged in: ", loggedIn);
    }
    else {
        logger.warn("Bot failed to login!");
        watcher.stop();
    }
});
//# sourceMappingURL=index.js.map