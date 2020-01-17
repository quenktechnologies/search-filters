"use strict";
/// <reference path='parser.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The parse module provides the API needed to convert a query string into an
 * abstract syntax tree.
 *
 * Use these apis if you are only interested in obtaining parser information
 * from a query string.
 */
/** imports */
var ast = require("./ast");
var parser = require("./parser");
var error_1 = require("@quenk/noni/lib/control/error");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * parse Source text, turning it into an abstract syntax tree.
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