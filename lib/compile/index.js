"use strict";
/// <reference path='../parse/parser.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.source2Term = exports.ast2Terms = exports.newContext = exports.defaultOptions = exports.DEFAULT_MAX_FILTERS = void 0;
/**
 * The compile module provides an API for building filter compilers.
 */
/** imports */
var ast = require("../parse/ast");
var either_1 = require("@quenk/noni/lib/data/either");
var record_1 = require("@quenk/noni/lib/data/record");
var parse_1 = require("../parse");
var policy_1 = require("./policy");
var error_1 = require("./error");
exports.DEFAULT_MAX_FILTERS = 25;
/**
 * defaultOptions for compilation.
 */
exports.defaultOptions = {
    maxFilters: exports.DEFAULT_MAX_FILTERS,
    ignoreUnknownFields: false
};
/**
 * newContext creates a new Context with default policies and options
 * set.
 */
var newContext = function (terms, policies, opts) {
    if (policies === void 0) { policies = {}; }
    if (opts === void 0) { opts = {}; }
    return ({
        options: (0, record_1.merge)(exports.defaultOptions, opts),
        terms: terms,
        policies: policies
    });
};
exports.newContext = newContext;
/**
 * ast2Terms converts an AST into a chain of Terms each representing a filter
 * to be applied.
 */
var ast2Terms = function (ctx, enabled, node) {
    if (node instanceof ast.Query) {
        if (node.terms.isNothing())
            return (0, either_1.right)(ctx.terms.empty());
        if (node.count > ctx.options.maxFilters)
            return (0, either_1.left)(new error_1.MaxFilterExceededErr(node.count, ctx.options.maxFilters));
        return (0, exports.ast2Terms)(ctx, enabled, node.terms.get());
    }
    else if ((node instanceof ast.And) || (node instanceof ast.Or)) {
        if (ctx.options.ignoreUnknownFields) {
            var mLhs = (0, policy_1.getPolicies)(ctx.policies, enabled, node.left.field.value);
            var mRhs = (0, policy_1.getPolicies)(ctx.policies, enabled, node.right.field.value);
            if ((mLhs.length === 0) || (mRhs.length === 0))
                return (0, either_1.right)(ctx.terms.empty());
        }
        var eitherL = (0, exports.ast2Terms)(ctx, enabled, node.left);
        if (eitherL.isLeft())
            return eitherL;
        var eitherR = (0, exports.ast2Terms)(ctx, enabled, node.right);
        if (eitherR.isLeft())
            return eitherR;
        var l = eitherL.takeRight();
        var r = eitherR.takeRight();
        if (node.type === 'and')
            return (0, either_1.right)(ctx.terms.and(l, r));
        else
            return (0, either_1.right)(ctx.terms.or(l, r));
    }
    else if (node instanceof ast.Filter) {
        var policies = (0, policy_1.getPolicies)(ctx.policies, enabled, node.field.value);
        var operator = node.operator;
        var value = (0, policy_1.toNative)(node.value);
        var field = node.field.value;
        var ex = (ctx.options.ignoreUnknownFields === true) ?
            (0, either_1.right)(ctx.terms.empty()) :
            (0, either_1.left)(new error_1.UnsupportedFieldErr(field, operator, value));
        return policies.reduce(function (p, c) {
            return p.isLeft() ? (0, policy_1.apply)(c, node) : p;
        }, ex);
    }
    else {
        return (0, either_1.left)(new Error("Unsupported node type \"".concat(node.type, "\"!")));
    }
};
exports.ast2Terms = ast2Terms;
/**
 * source2Term transform Source text directly into a Term chain.
 */
var source2Term = function (ctx, enabled, src) {
    return (0, parse_1.parse)(src).chain(function (n) { return (0, exports.ast2Terms)(ctx, enabled, n); });
};
exports.source2Term = source2Term;
/**
 * compile source text into a type <T> that represents a filter in the target
 * language.
 *
 * Succesful compilation depends on the fields used in the source text
 * complying with the policies indicated in the enabled argument.
 */
var compile = function (ctx, enabled, src) {
    return (0, exports.source2Term)(ctx, enabled, src).chain(function (r) { return r.compile(); });
};
exports.compile = compile;
//# sourceMappingURL=index.js.map