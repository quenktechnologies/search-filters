"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='parser.d.ts' />
var ast = require("./ast");
var parser = require("./parser");
var error_1 = require("@quenk/noni/lib/control/error");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * parse a string turning it into an AST of filters.
 */
exports.parse = function (source) {
    return error_1.attempt(function () {
        parser.parser.yy = { ast: ast, nothing: maybe_1.nothing(), filterCount: 0 };
        return parser.parser.parse(source);
    });
};
//# sourceMappingURL=parse.js.map