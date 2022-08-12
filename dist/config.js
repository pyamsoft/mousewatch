"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceConfig = void 0;
var logger_1 = require("./bot/logger");
var logger = (0, logger_1.newLogger)("BotConfig");
// Use require here instead of import
//
// Parse the .env file if one exists
require("dotenv").config();
var sourceConfig = function () {
    var config = Object.freeze({
        prefix: process.env.BOT_PREFIX || "$",
        token: process.env.BOT_TOKEN || "",
        specificChannel: process.env.BOT_CHANNEL_ID || "",
    });
    logger.log("Bot Config: ", config);
    return config;
};
exports.sourceConfig = sourceConfig;
//# sourceMappingURL=config.js.map