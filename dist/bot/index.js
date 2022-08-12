"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeBot = void 0;
var discord_js_1 = require("discord.js");
var logger_1 = require("./logger");
var id_1 = require("./model/id");
var listener_1 = require("./model/listener");
var messages_1 = require("./message/messages");
var MessageCache_1 = require("./message/MessageCache");
var MessageEventType_1 = require("./model/MessageEventType");
var logger = (0, logger_1.newLogger)("DiscordBot");
var initializeBot = function (config) {
    var client = new discord_js_1.Client({
        intents: [
            discord_js_1.Intents.FLAGS.GUILDS,
            discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
            discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        ],
        partials: ["MESSAGE", "CHANNEL"],
    });
    var handlers = {};
    var messageCache = (0, MessageCache_1.createMessageCache)();
    // Keep this cached to avoid having to recalculate it each time
    var handlerList = [];
    var messageHandler = function (message) {
        (0, messages_1.handleBotMessage)(config, MessageEventType_1.MessageEventTypes.CREATE, message, undefined, {
            handlers: handlerList,
            cache: messageCache,
        });
    };
    var messageUpdateHandler = function (oldMessage, newMessage) {
        (0, messages_1.handleBotMessage)(config, MessageEventType_1.MessageEventTypes.UPDATE, newMessage, oldMessage, {
            handlers: handlerList,
            cache: messageCache,
        });
    };
    return Object.freeze({
        addHandler: function (type, handler) {
            var id = (0, id_1.generateRandomId)();
            handlers[id] = { id: id, handler: handler, type: type };
            logger.log("Add new handler: ", handlers[id]);
            handlerList = Object.values(handlers).filter(function (h) { return !!h; });
            return id;
        },
        removeHandler: function (id) {
            if (handlers[id]) {
                logger.log("Removed handler: ", handlers[id]);
                handlers[id] = undefined;
                handlerList = Object.values(handlers).filter(function (h) { return !!h; });
                return true;
            }
            else {
                return false;
            }
        },
        watchMessages: function (onStop) {
            var readyHandler = function () {
                logger.log("Bot is ready!");
                logger.log("Watch for messages");
                client.on(MessageEventType_1.MessageEventTypes.CREATE, messageHandler);
                client.on(MessageEventType_1.MessageEventTypes.UPDATE, messageUpdateHandler);
            };
            var errorHandler = function (error) {
                logger.error(error, "BOT ERROR");
                client.off("ready", readyHandler);
                client.off(MessageEventType_1.MessageEventTypes.CREATE, messageHandler);
                client.off(MessageEventType_1.MessageEventTypes.UPDATE, messageUpdateHandler);
                onStop();
            };
            client.on("error", errorHandler);
            logger.log("Wait until bot is ready");
            client.once("ready", readyHandler);
            return (0, listener_1.newListener)(function () {
                logger.log("Stop watching for messages");
                client.off("ready", readyHandler);
                client.off(MessageEventType_1.MessageEventTypes.CREATE, messageHandler);
                client.off(MessageEventType_1.MessageEventTypes.UPDATE, messageUpdateHandler);
                onStop();
            });
        },
        login: function () {
            var token = config.token;
            return client
                .login(token)
                .then(function () {
                logger.log("Bot logged in!");
                return true;
            })
                .catch(function (e) {
                logger.error(e, "Error logging in");
                return false;
            });
        },
    });
};
exports.initializeBot = initializeBot;
//# sourceMappingURL=index.js.map