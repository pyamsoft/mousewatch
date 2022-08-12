"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonApi = void 0;
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
var jsonApi = function (url) {
    return (0, axios_1.default)({
        method: "GET",
        url: url,
    }).then(function (r) { return r.data; });
};
exports.jsonApi = jsonApi;
//# sourceMappingURL=api.js.map