"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpHandler = void 0;
var MessageHandler_1 = require("../bot/message/MessageHandler");
var logger_1 = require("../bot/logger");
var help_1 = require("./outputs/help");
var TAG = "HelpHandler";
var logger = (0, logger_1.newLogger)(TAG);
exports.HelpHandler = {
    tag: TAG,
    handle: function (config, command) {
        // Only handle help
        var currentCommand = command.currentCommand;
        if (!currentCommand.isHelpCommand) {
            return;
        }
        logger.log("Handle help message", currentCommand);
        return Promise.resolve((0, MessageHandler_1.messageHandlerHelpText)((0, help_1.outputHelpText)(config)));
    },
};
//# sourceMappingURL=help.js.map