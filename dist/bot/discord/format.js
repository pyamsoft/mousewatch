"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.italic = exports.bold = exports.codeBlock = exports.code = void 0;
var code = function (message) {
    return "`".concat(message, "`");
};
exports.code = code;
var codeBlock = function (message) {
    return "```".concat(message, "```");
};
exports.codeBlock = codeBlock;
var bold = function (message) {
    return "**".concat(message, "**");
};
exports.bold = bold;
var italic = function (message) {
    return "*".concat(message, "*");
};
exports.italic = italic;
//# sourceMappingURL=format.js.map