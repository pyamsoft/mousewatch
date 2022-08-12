"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageCache = void 0;
var logger_1 = require("../logger");
var logger = (0, logger_1.newLogger)("MessageCache");
var DEFAULT_TIMEOUT = 2 * 60 * 60 * 1000;
var createMessageCache = function (timeout) {
    if (timeout === void 0) { timeout = DEFAULT_TIMEOUT; }
    var cache = {};
    var invalidateCache = function () {
        var now = new Date();
        // Clear out any stale entries
        for (var _i = 0, _a = Object.keys(cache); _i < _a.length; _i++) {
            var id = _a[_i];
            var oldData = cache[id];
            // Already cleared out
            if (!oldData) {
                continue;
            }
            for (var _b = 0, _c = Object.keys(oldData); _b < _c.length; _b++) {
                var keyed = _c[_b];
                var checking = oldData[keyed];
                // Already cleared out
                if (!checking) {
                    continue;
                }
                if (now.valueOf() - timeout > checking.lastUsed.valueOf()) {
                    logger.log("Evicted old data from cache: ", {
                        now: now,
                        id: id,
                        keyed: keyed,
                        checking: checking,
                    });
                    oldData[keyed] = undefined;
                }
            }
        }
    };
    var filterCached = function (cached) {
        var cleaned = {};
        for (var _i = 0, _a = Object.keys(cached); _i < _a.length; _i++) {
            var key = _a[_i];
            var data = cached[key];
            if (data) {
                cleaned[key] = data.msg;
            }
        }
        return cleaned;
    };
    var getAllForId = function (id) {
        if (!id) {
            return {};
        }
        var cached = cache[id];
        if (!cached) {
            return {};
        }
        return cached;
    };
    return {
        get: function (messageId, key) {
            // Remove stale
            invalidateCache();
            var keyed = filterCached(getAllForId(messageId));
            return keyed[key] || undefined;
        },
        getAll: function (messageId) {
            // Remove stale
            invalidateCache();
            return filterCached(getAllForId(messageId));
        },
        insert: function (messageId, key, message) {
            if (!cache[messageId]) {
                cache[messageId] = {};
            }
            // We know this is truthy because of above
            var writeable = cache[messageId];
            writeable[key] = {
                msg: message,
                lastUsed: new Date(),
            };
            // Remove any stale
            invalidateCache();
        },
        remove: function (messageId, key) {
            var keyed = getAllForId(messageId);
            keyed[key] = undefined;
            // Remove stale
            invalidateCache();
        },
        removeAll: function (messageId) {
            cache[messageId] = undefined;
            // Remove stale
            invalidateCache();
        },
    };
};
exports.createMessageCache = createMessageCache;
//# sourceMappingURL=MessageCache.js.map