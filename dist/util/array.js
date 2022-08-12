"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureArray = void 0;
var ensureArray = function (oneOrMany) {
    var list;
    if (Array.isArray(oneOrMany)) {
        list = oneOrMany;
    }
    else {
        list = [oneOrMany];
    }
    return list;
};
exports.ensureArray = ensureArray;
//# sourceMappingURL=array.js.map