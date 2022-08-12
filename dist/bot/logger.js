"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newLogger = void 0;
var tslib_1 = require("tslib");
var isDebug = process.env.BOT_ENV !== "production";
var logTag = function (prefix) {
    return "<".concat(prefix, ">");
};
var newLogger = function (prefix) {
    var tag = prefix ? logTag(prefix) : "";
    return {
        print: function print() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log.apply(console, tslib_1.__spreadArray([tag], args, false));
        },
        log: function log() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (isDebug) {
                this.print.apply(this, args);
            }
        },
        warn: function warn() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (isDebug) {
                console.warn.apply(console, tslib_1.__spreadArray([tag], args, false));
            }
        },
        error: function error(e) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (isDebug) {
                console.error.apply(console, tslib_1.__spreadArray([tag, e], args, false));
            }
        },
    };
};
exports.newLogger = newLogger;
//# sourceMappingURL=logger.js.map