"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendChannelFromMessage = exports.messageFromMsg = exports.removerFromMessage = exports.editorFromMessage = exports.msgFromMessage = exports.logMsg = void 0;
var logMsg = function (m) {
    return {
        id: m.id,
        content: m.content,
    };
};
exports.logMsg = logMsg;
var msgFromMessage = function (message) {
    return {
        id: message.id,
        author: message.author,
        channel: message.channel,
        content: message.content,
        raw: message,
    };
};
exports.msgFromMessage = msgFromMessage;
var editorFromMessage = function (message) {
    return {
        edit: function (newMessageText) {
            return message
                .edit(newMessageText)
                .then(function (msg) { return (0, exports.msgFromMessage)(msg); });
        },
    };
};
exports.editorFromMessage = editorFromMessage;
var removerFromMessage = function (message) {
    return {
        remove: function () {
            return message.delete().then(function (msg) { return msg.id; });
        },
    };
};
exports.removerFromMessage = removerFromMessage;
var messageFromMsg = function (message) {
    return message.raw;
};
exports.messageFromMsg = messageFromMsg;
var sendChannelFromMessage = function (message) {
    return {
        send: function (messageText) {
            var channel = message.channel;
            // Typescript is lame but I know this field exists on a message channel
            return channel
                .send(messageText)
                .then(function (msg) { return (0, exports.msgFromMessage)(msg); });
        },
    };
};
exports.sendChannelFromMessage = sendChannelFromMessage;
//# sourceMappingURL=Msg.js.map