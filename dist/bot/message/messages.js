"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBotMessage = void 0;
var logger_1 = require("../logger");
var Msg_1 = require("./Msg");
var validate_1 = require("./validate");
var communicate_1 = require("./communicate");
var logger = (0, logger_1.newLogger)("messages");
// @ts-ignore
var sendMessageAfterParsing = function (results, message, sendChannel, env) {
    // None of our handlers have done this, if we continue, behavior is undefined
    if (results.length <= 0) {
        logger.warn("No results, unhandled message: ", (0, Msg_1.logMsg)(message));
        return;
    }
    var combinedOutputs = {};
    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
        var res = results_1[_i];
        // Any help outputs immediately stop the message sending
        if (!!res.helpOutput && !!res.helpOutput.trim()) {
            (0, communicate_1.sendMessage)(message.id, sendChannel, (0, communicate_1.createCommunicationMessage)(res.helpOutput), env).then(function (responded) {
                logger.log("Responded with help text", !!responded);
            });
            return;
        }
        else {
            for (var _a = 0, _b = Object.keys(res.messages); _a < _b.length; _a++) {
                var key = _b[_a];
                combinedOutputs[key] = res.messages[key];
            }
        }
    }
    // Otherwise we've collected all of our output, so spit it out into a single message
    (0, communicate_1.sendMessage)(message.id, sendChannel, (0, communicate_1.createCommunicationResult)(combinedOutputs), env).then(function (responded) {
        logger.log("Responded with combined output for keys: ", Object.keys(combinedOutputs), !!responded);
    });
};
var toCommand = function (config, content) {
    return {
        prefix: config.prefix,
        isHelpCommand: true,
        content: content,
    };
};
var handleBotMessage = function (config, 
// @ts-ignore
eventType, message, optionalOldMessage, 
// @ts-ignore
env) {
    var msg = (0, Msg_1.msgFromMessage)(message);
    if (!(0, validate_1.validateMessage)(config, msg)) {
        return;
    }
    var oldMsg = optionalOldMessage
        ? (0, Msg_1.msgFromMessage)(optionalOldMessage)
        : undefined;
    var sendChannel = (0, Msg_1.sendChannelFromMessage)(message);
    var current = toCommand(config, msg.content);
    var old = oldMsg ? toCommand(config, oldMsg.content) : undefined;
    var work = [];
    var handlers = env.handlers;
    for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
        var item = handlers_1[_i];
        // If it was removed, skip it
        if (!item) {
            continue;
        }
        var handler = item.handler, id = item.id, type = item.type;
        if (type === eventType) {
            var output = handler.handle(config, {
                currentCommand: current,
                oldCommand: old,
            });
            if (output) {
                logger.log("Pass message to handler: ", {
                    id: id,
                    type: type,
                    name: handler.tag,
                });
                work.push(output);
            }
        }
    }
    Promise.all(work).then(function (results) {
        return sendMessageAfterParsing(results, msg, sendChannel, env);
    });
};
exports.handleBotMessage = handleBotMessage;
//# sourceMappingURL=messages.js.map