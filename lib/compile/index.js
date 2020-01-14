"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='../parser/parser.d.ts' />
var ast = require("../parser/ast");
var either_1 = require("@quenk/noni/lib/data/either");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var parser_1 = require("../parser");
var policy_1 = require("./context/policy");
/**
 * defaultOptions for compilation.
 */
exports.defaultOptions = {
    /**
     * maxFilters allowed in a query string.
     */
    maxFilters: 100
};
/**
 * maxFilterExceededErr constructs an Err indicating the maximum amount of
 * filters allowed has been surpassed.
 */
exports.maxFilterExceededErr = function (n, max) {
    return ({ n: n, max: max, message: "Max " + max + " filters are allowed, got " + n + "!" });
};
/**
 * invalidFilterFieldErr constructs an Err indicating the filter encountered
 * is not supported.
 */
exports.invalidFilterFieldErr = function (_a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return ({ field: field, operator: operator, value: value, message: "Invalid field " + field + "!" });
};
/**
 * ast2Terms converts an AST into a graph of Terms representing a chain of
 * filters.
 */
exports.ast2Terms = function (ctx, n) {
    if (n instanceof ast.Query) {
        if (n.terms.isNothing())
            return either_1.right(ctx.terms.empty());
        if (n.count > ctx.options.maxFilters)
            return either_1.left(exports.maxFilterExceededErr(n.count, ctx.options.maxFilters));
        return exports.ast2Terms(ctx, n.terms.get());
    }
    else if ((n instanceof ast.And) || (n instanceof ast.Or)) {
        var eitherL = exports.ast2Terms(ctx, n.left);
        if (eitherL.isLeft())
            return eitherL;
        var eitherR = exports.ast2Terms(ctx, n.right);
        if (eitherR.isLeft())
            return eitherR;
        var l = eitherL.takeRight();
        var r = eitherR.takeRight();
        if (n.type === 'and')
            return either_1.right(ctx.terms.and(ctx, l, r));
        else
            return either_1.right(ctx.terms.or(ctx, l, r));
    }
    else if (n instanceof ast.Filter) {
        var maybePolicy = maybe_1.fromNullable(ctx.policies[n.field.value]);
        if (maybePolicy.isJust())
            return policy_1.apply(ctx, maybePolicy.get(), n);
        var operator = n.operator, value = n.value;
        var field = n.field.value;
        return either_1.left(exports.invalidFilterFieldErr({ field: field, operator: operator, value: value }));
    }
    else {
        return either_1.left(new Error("Unsupported node type \"" + n.type + "\"!"));
    }
};
/**
 * source2Term transform source text to a Term chain.
 */
exports.source2Term = function (ctx, source) {
    return parser_1.parse(source).chain(function (n) { return exports.ast2Terms(ctx, n); });
};
//# sourceMappingURL=index.js.map