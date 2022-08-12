"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newListener = void 0;
var newListener = function (stopListening) {
    return Object.freeze({
        stop: function () {
            stopListening();
        },
    });
};
exports.newListener = newListener;
//# sourceMappingURL=listener.js.map