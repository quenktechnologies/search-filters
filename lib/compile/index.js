"use strict";
/// <reference path='../parse/parser.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The compile modules provides an API for building compilers on top of
 * the library.
 */
/** imports */
var ast = require("../parse/ast");
var either_1 = require("@quenk/noni/lib/data/either");
var record_1 = require("@quenk/noni/lib/data/record");
var parse_1 = require("../parse");
var set_1 = require("./policy/set");
var policy_1 = require("./policy");
exports.DEFAULT_MAX_FILTERS = 25;
/**
 * defaultOptions for compilation.
 */
exports.defaultOptions = {
    maxFilters: exports.DEFAULT_MAX_FILTERS,
    ignoreUnknownFields: false
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
 * newContext creates a new Context with default policies and options set.
 */
exports.newContext = function (terms, policies, opts) {
    if (policies === void 0) { policies = {}; }
    if (opts === void 0) { opts = {}; }
    return ({
        options: record_1.merge(exports.defaultOptions, opts),
        terms: terms,
        policies: policies
    });
};
/**
 * ast2Terms converts an AST into a chain of Terms each representing a filter
 * to be applied.
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
        if (ctx.options.ignoreUnknownFields)
            if ((set_1.resolve(ctx.policies, n.left.field.value).isNothing()) ||
                set_1.resolve(ctx.policies, n.right.field.value).isNothing())
                return either_1.right(ctx.terms.empty());
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
        var maybePolicy = set_1.resolve(ctx.policies, n.field.value);
        if (maybePolicy.isJust())
            return policy_1.apply(ctx, maybePolicy.get(), n);
        if (ctx.options.ignoreUnknownFields === true)
            return either_1.right(ctx.terms.empty());
        var operator = n.operator;
        var value = policy_1.toNative(n.value);
        var field = n.field.value;
        return either_1.left(exports.invalidFilterFieldErr({ field: field, operator: operator, value: value }));
    }
    else {
        return either_1.left(new Error("Unsupported node type \"" + n.type + "\"!"));
    }
};
/**
 * source2Term transform Source text directly into a Term chain.
 */
exports.source2Term = function (ctx, src) {
    return parse_1.parse(src).chain(function (n) { return exports.ast2Terms(ctx, n); });
};
/**
 * compile source text into a type <T> that represents a filter.
 */
exports.compile = function (ctx, src) {
    return exports.source2Term(ctx, src).chain(function (r) { return r.compile(); });
};
//# sourceMappingURL=index.js.map