"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Parser.d.ts' />
var ast = require("./ast");
var Parser = require("./Parser");
var match_1 = require("@quenk/match");
var Either_1 = require("afpl/lib/monad/Either");
var Maybe_1 = require("afpl/lib/monad/Maybe");
/**
 * defaultOptions
 */
exports.defaultOptions = {
    maxFilters: 100,
};
;
/**
 * maxFilterExceededErr indicates the maximum amount of filters allowed
 * has been surpassed.
 */
exports.maxFilterExceededErr = function (n, max) {
    return ({ n: n, max: max, message: "Max " + max + " filters are allowed, got " + n + "!" });
};
/**
 * invalidFilterFieldErr invalid indicates the filter supplied is not supported.
 */
exports.invalidFilterFieldErr = function (_a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return ({ field: field, operator: operator, value: value, message: "Invalid field " + field + "!" });
};
/**
 * invalidFilterOperatorErr indicates an invalid operator was supplied.
 */
exports.invalidFilterOperatorErr = function (_a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return ({ field: field, operator: operator, value: value, message: "Invalid operator '" + operator + "' used with field '" + field + "'!" });
};
/**
 * invalidFilterTypeErr indicates the value used with the filter is the incorrect type.
 */
exports.invalidFilterTypeErr = function (_a, typ) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return ({
        field: field,
        operator: operator,
        value: value,
        message: "Invalid type '" + typeof value + "' for field '" + field + "', expected type of '" + typ + "'!"
    });
};
/**
 * checkType to ensure they match.
 */
var checkType = function (typ, value) {
    return (Array.isArray(value) && typ === 'array') ? true :
        (typeof value === typ) ? true : false;
};
/**
 * count the number of filters in the AST.
 */
exports.count = function (n) { return match_1.match(n)
    .caseOf(ast.And, function (n) { return exports.count(n.left) + exports.count(n.right); })
    .caseOf(ast.Or, function (n) { return exports.count(n.left) + exports.count(n.right); })
    .caseOf(ast.Filter, function () { return 1; })
    .orElse(function () { return 0; })
    .end(); };
/**
 * ensureFilterLimit prevents abuse via excessively long queries.
 */
exports.ensureFilterLimit = function (n, max) {
    return (max <= 0) ?
        Either_1.Either
            .right(n) :
        Either_1.Either
            .right(exports.count(n))
            .chain(function (c) { return (c > max) ?
            Either_1.Either
                .left(exports.maxFilterExceededErr(c, max)) :
            Either_1.Either
                .right(n); });
};
/**
 * value2JS converts a parseed value node into a JS value.
 */
exports.value2JS = function (v) { return match_1.match(v)
    .caseOf(ast.List, function (_a) {
    var members = _a.members;
    return members.map(exports.value2JS);
})
    .caseOf(ast.Literal, function (_a) {
    var value = _a.value;
    return value;
})
    .end(); };
/**
 * parse a string turning it into an Abstract Syntax Tree.
 */
exports.parse = function (ast) { return function (source) {
    try {
        Parser.parser.yy = { ast: ast };
        return Either_1.right(Parser.parser.parse(source));
    }
    catch (e) {
        return Either_1.left(e);
    }
}; };
exports.parse$ = exports.parse(ast);
/**
 * ast2Terms converts an AST into a graph of verticies starting at the root node.
 */
exports.ast2Terms = function (ctx) { return function (policies) { return function (n) {
    return match_1.match(n)
        .caseOf(ast.Conditions, parseRoot(ctx)(policies))
        .caseOf(ast.Filter, parseFilter(ctx)(policies))
        .caseOf(ast.And, parseAndOr(ctx)(policies))
        .caseOf(ast.Or, parseAndOr(ctx)(policies))
        .orElse(function () { return Either_1.Either.left({ message: "Unsupported node type " + n.type + "!" }); })
        .end();
}; }; };
var parseRoot = function (ctx) { return function (policies) { return function (n) {
    return Maybe_1.Maybe
        .fromAny(n.conditions)
        .map(function (c) {
        return exports.ensureFilterLimit(c, ctx.options.maxFilters)
            .chain(function (c) { return exports.ast2Terms(ctx)(policies)(c); });
    })
        .orJust(function () { return Either_1.right(ctx.empty()); })
        .get();
}; }; };
var parseAndOr = function (ctx) { return function (policies) { return function (n) {
    return (exports.ast2Terms(ctx)(policies)(n.left))
        .chain(function (lv) {
        return (exports.ast2Terms(ctx)(policies)(n.right))
            .map(function (rv) { return match_1.match(n)
            .caseOf(ast.And, function () { return ctx.and(ctx)(lv)(rv); })
            .caseOf(ast.Or, function () { return ctx.or(ctx)(lv)(rv); })
            .end(); });
    });
}; }; };
var parseFilter = function (ctx) { return function (policies) { return function (_a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return Maybe_1.Maybe
        .fromAny(exports.value2JS(value))
        .chain(function (value) {
        return Maybe_1.Maybe
            .fromAny(policies[field])
            .chain(resolvePolicy(ctx.policies))
            .map(function (p) {
            return !checkType(p.type, value) ?
                Either_1.left(exports.invalidFilterTypeErr({ field: field, operator: operator, value: value }, p.type)) :
                (operator === 'default') ?
                    Either_1.right((p.term(ctx)({ field: field, operator: p.operators[0], value: value }))) :
                    (p.operators.indexOf(operator) > -1) ?
                        Either_1.right(p.term(ctx)({ field: field, operator: operator, value: value })) :
                        Either_1.left(exports.invalidFilterOperatorErr({ field: field, operator: operator, value: value }));
        })
            .orJust(function () { return Either_1.left(exports.invalidFilterFieldErr({ field: field, operator: operator, value: value })); });
    })
        .get();
}; }; };
var resolvePolicy = function (available) { return function (specified) {
    return Maybe_1.Maybe
        .fromBoolean((typeof specified === 'string'))
        .chain(function () { return Maybe_1.Maybe.fromAny(available[specified]); })
        .orJust(function () { return specified; });
}; };
/**
 * term source text to a Term.
 */
exports.term = function (ctx) { return function (policies) { return function (source) {
    return exports.parse$(source)
        .chain(exports.ast2Terms(ctx)(policies));
}; }; };
/**
 * compile a string into a usable string of filters.
 */
exports.compile = function (ctx) { return function (policies) { return function (source) {
    return (exports.term(ctx)(policies)(source))
        .chain(function (v) { return v.compile(); });
}; }; };
//# sourceMappingURL=index.js.map