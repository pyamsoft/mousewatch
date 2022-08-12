"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputHelpText = void 0;
var format_1 = require("../../bot/discord/format");
var outputHelpText = function (config) {
    var prefix = config.prefix;
    var p = function (text) {
        return "".concat(prefix).concat(text);
    };
    return (0, format_1.codeBlock)("\nBeep Boop.\n\n[COMMANDS]\n".concat(p("                       This help"), "\n\nWhat is my purpose?\n"));
};
exports.outputHelpText = outputHelpText;
//# sourceMappingURL=help.js.map