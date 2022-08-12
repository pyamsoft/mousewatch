"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHandlerHelpText = exports.messageHandlerOutput = void 0;
var messageHandlerOutput = function (messages) {
    return {
        objectType: "MessageHandlerOutput",
        helpOutput: "",
        messages: messages,
    };
};
exports.messageHandlerOutput = messageHandlerOutput;
var messageHandlerHelpText = function (message) {
    return {
        objectType: "MessageHandlerOutput",
        helpOutput: message,
        messages: {},
    };
};
exports.messageHandlerHelpText = messageHandlerHelpText;
//# sourceMappingURL=MessageHandler.js.map