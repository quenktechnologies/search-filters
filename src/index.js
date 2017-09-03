"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Parser.d.ts' />
var Node = require("./Node");
exports.Node = Node;
var Parser = require("./Parser");
exports.parse = function (str, ast) {
    if (ast === void 0) { ast = Node; }
    Parser.parser.yy = { ast: ast };
    return Parser.parser.parse(str);
};
//# sourceMappingURL=index.js.map