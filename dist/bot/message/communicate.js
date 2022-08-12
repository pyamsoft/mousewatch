"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.createCommunicationResult = exports.createCommunicationMessage = void 0;
var tslib_1 = require("tslib");
var logger_1 = require("../logger");
var Msg_1 = require("./Msg");
var array_1 = require("../../util/array");
var GLOBAL_CACHE_KEY = "global-cache-key";
var logger = (0, logger_1.newLogger)("communicate");
var createCommunicationMessage = function (message) {
    return {
        objectType: "CommunicationMessage",
        message: message,
    };
};
exports.createCommunicationMessage = createCommunicationMessage;
var createCommunicationResult = function (data) {
    return {
        objectType: "CommunicationResult",
        data: data,
    };
};
exports.createCommunicationResult = createCommunicationResult;
var deleteOldMessages = function (receivedMessageId, keys, env) {
    var cache = env.cache;
    var allOldData = cache.getAll(receivedMessageId);
    var oldContents = Object.keys(allOldData);
    if (oldContents.length <= 0) {
        logger.log("No old contents to delete, continue.");
        return Promise.resolve();
    }
    var work = [];
    var _loop_1 = function (key) {
        // If the new message replacing this one does not include previous existing content, delete the old message
        // that holds the old content
        if (!keys.includes(key) && oldContents.includes(key)) {
            var oldMessage_1 = allOldData[key];
            // Double check
            if (!oldMessage_1) {
                return "continue";
            }
            logger.log("Key existed in old message but not new message, delete it", {
                oldContent: key,
                newContents: keys,
            });
            // We know this to be true
            var remover = (0, Msg_1.removerFromMessage)((0, Msg_1.messageFromMsg)(oldMessage_1));
            var working = remover
                .remove()
                .then(function (id) {
                logger.log("Deleted old message: ", {
                    key: key,
                    messageId: id,
                });
                cache.remove(receivedMessageId, key);
            })
                .catch(function (e) {
                logger.error(e, "Failed to delete old message", {
                    key: key,
                    messageId: oldMessage_1.id,
                });
            });
            // Add to the list of jobs we are waiting for
            work.push(working);
        }
    };
    for (var _i = 0, oldContents_1 = oldContents; _i < oldContents_1.length; _i++) {
        var key = oldContents_1[_i];
        _loop_1(key);
    }
    return Promise.all(work);
};
var postNewMessages = function (messageId, channel, keys, messages, env) {
    var work = [];
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var messageText = messages[key];
        if (!!messageText && !!messageText.trim()) {
            var working = postMessageToPublicChannel(messageId, channel, messageText, tslib_1.__assign(tslib_1.__assign({}, env), { cacheKey: key, cacheResult: true }));
            // Add to the list of jobs we are waiting for
            work.push(working);
        }
    }
    return Promise.all(work).then(function (results) {
        var messagesOnly = [];
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var msg = results_1[_i];
            if (!!msg) {
                messagesOnly.push(msg);
            }
        }
        return messagesOnly;
    });
};
var editExistingMessage = function (receivedMessageId, editor, oldMessage, messageText, env) {
    var cache = env.cache, cacheKey = env.cacheKey, cacheResult = env.cacheResult;
    return new Promise(function (resolve) {
        editor
            .edit(messageText)
            .then(function (newMessage) {
            logger.log("Updated old message with new content: ", {
                key: cacheKey,
                oldMessageId: oldMessage.id,
                newMessageId: newMessage.id,
                receivedMessageId: receivedMessageId,
            });
            if (cacheResult) {
                logger.log("Caching update result: ", {
                    messageId: receivedMessageId,
                    key: cacheKey,
                });
                cache.insert(receivedMessageId, cacheKey, newMessage);
                resolve(newMessage);
            }
        })
            .catch(function (e) {
            logger.error(e, "Unable to update old message with new content: ", {
                key: cacheKey,
                oldMessageId: oldMessage.id,
                receivedMessageId: receivedMessageId,
            });
            resolve(undefined);
        });
    });
};
var sendNewMessageToChannel = function (receivedMessageId, channel, messageText, env) {
    var cache = env.cache, cacheKey = env.cacheKey, cacheResult = env.cacheResult;
    return new Promise(function (resolve) {
        channel
            .send(messageText)
            .then(function (newMessage) {
            logger.log("Send new message: ", {
                messageId: newMessage.id,
                receivedMessageId: receivedMessageId,
                key: cacheKey,
            });
            if (cacheResult) {
                logger.log("Caching new message result: ", {
                    messageId: newMessage.id,
                    receivedMessageId: receivedMessageId,
                    key: cacheKey,
                });
                cache.insert(receivedMessageId, cacheKey, newMessage);
            }
            resolve(newMessage);
        })
            .catch(function (e) {
            logger.error(e, "Unable to send message", {
                key: cacheKey,
                text: messageText,
                receivedMessageId: receivedMessageId,
            });
            resolve(undefined);
        });
    });
};
var postMessageToPublicChannel = function (receivedMessageId, channel, messageText, env) {
    var cache = env.cache, cacheKey = env.cacheKey;
    var oldMessage = !!cacheKey && !!cacheKey.trim()
        ? cache.get(receivedMessageId, cacheKey)
        : undefined;
    if (oldMessage) {
        // We know this to be true
        var editor = (0, Msg_1.editorFromMessage)((0, Msg_1.messageFromMsg)(oldMessage));
        return editExistingMessage(receivedMessageId, editor, oldMessage, messageText, env);
    }
    else {
        return sendNewMessageToChannel(receivedMessageId, channel, messageText, env);
    }
};
var sendMessage = function (receivedMessageId, channel, content, env) {
    if (content.objectType === "CommunicationMessage") {
        // Plain text message
        return postMessageToPublicChannel(receivedMessageId, channel, content.message, tslib_1.__assign(tslib_1.__assign({}, env), { cacheKey: GLOBAL_CACHE_KEY, cacheResult: true })).then(function (msg) {
            if (msg) {
                return (0, array_1.ensureArray)(msg);
            }
            else {
                return [];
            }
        });
    }
    else {
        var data_1 = content.data;
        // Delete any old messages first
        var keys_2 = Object.keys(data_1);
        return deleteOldMessages(receivedMessageId, keys_2, env).then(function () {
            return postNewMessages(receivedMessageId, channel, keys_2, data_1, env);
        });
    }
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=communicate.js.map