"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='parser.d.ts' />
var ast = require("./ast");
var parser = require("./parser");
var error_1 = require("@quenk/noni/lib/control/error");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * parse a Source string turning it into an abstract syntax tree.
 *
 * Any errors encountered result in a Left<Err> value, success Right<Query>.
 */
exports.parse = function (source) {
    return error_1.attempt(function () {
        parser.parser.yy = {
            ast: ast,
            nothing: maybe_1.nothing(),
            just: maybe_1.just,
            filterCount: 0
        };
        return parser.parser.parse(source);
    });
};
//# sourceMappingURL=index.js.map