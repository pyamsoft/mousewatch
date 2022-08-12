"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessage = exports.validateMessageIsWatched = exports.validateMessageIsSpecificChannel = exports.validateMessageIsTextChannel = exports.validateMessageHasChannel = exports.validateMessageIsNotFromBot = exports.validateMessageHasId = void 0;
var validateMessageHasId = function (message) {
    return !!message.id;
};
exports.validateMessageHasId = validateMessageHasId;
var validateMessageIsNotFromBot = function (message) {
    return !message.author.bot;
};
exports.validateMessageIsNotFromBot = validateMessageIsNotFromBot;
var validateMessageHasChannel = function (message) {
    return !!message.channel;
};
exports.validateMessageHasChannel = validateMessageHasChannel;
var validateMessageIsTextChannel = function (message) {
    // TODO(Peter): Support DM messages
    return message.channel.type === "GUILD_TEXT";
};
exports.validateMessageIsTextChannel = validateMessageIsTextChannel;
var validateMessageIsSpecificChannel = function (config, message) {
    if (config.specificChannel) {
        // I know this works, discord is dumb
        var ch = message.channel;
        return ch.id === config.specificChannel;
    }
    else {
        return true;
    }
};
exports.validateMessageIsSpecificChannel = validateMessageIsSpecificChannel;
var validateMessageIsWatched = function (config, message) {
    return message.content.startsWith(config.prefix);
};
exports.validateMessageIsWatched = validateMessageIsWatched;
var validateMessage = function (config, message) {
    if (!(0, exports.validateMessageHasId)(message)) {
        return false;
    }
    if (!(0, exports.validateMessageIsNotFromBot)(message)) {
        return false;
    }
    if (!(0, exports.validateMessageHasChannel)(message)) {
        return false;
    }
    if (!(0, exports.validateMessageIsTextChannel)(message)) {
        return false;
    }
    if (!(0, exports.validateMessageIsSpecificChannel)(config, message)) {
        return false;
    }
    if (!(0, exports.validateMessageIsWatched)(config, message)) {
        return false;
    }
    // Looks good
    return true;
};
exports.validateMessage = validateMessage;
//# sourceMappingURL=validate.js.map