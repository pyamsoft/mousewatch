"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeParseNumber = void 0;
var logger_1 = require("../bot/logger");
var logger = (0, logger_1.newLogger)("NumberUtils");
var safeParseNumber = function (s) {
    try {
        return parseFloat(s);
    }
    catch (e) {
        logger.error(e, "Failed to parse to float: ", s);
        return -1;
    }
};
exports.safeParseNumber = safeParseNumber;
//# sourceMappingURL=number.js.map