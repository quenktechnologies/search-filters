"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast = require("../../ast");
var either_1 = require("@quenk/noni/lib/data/either");
/**
 * maxFilterExceededErr indicates the maximum amount of filters allowed
 * has been surpassed.
 */
exports.maxFilterExceededErr = function (n, max) {
    return ({ n: n, max: max, message: "Max " + max + " filters are allowed, got " + n + "!" });
};
/**
 * invalidFilterOperatorErr indicates an invalid operator was supplied.
 */
exports.invalidFilterOperatorErr = function (_a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return ({
        field: field, operator: operator, value: value,
        message: "Invalid operator '" + operator + "' used with field '" + field + "'!"
    });
};
/**
 * invalidFilterTypeErr indicates the value used with the
 * filter is the incorrect type.
 */
exports.invalidFilterTypeErr = function (_a, typ) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return ({
        field: field,
        operator: operator,
        value: value,
        message: "Invalid type '" + typeof value + "' for field '" + field + "'," +
            (" expected type of '" + typ + "'!")
    });
};
/**
 * toNative converts a parsed value into a JS native value.
 */
exports.toNative = function (v) {
    return (v instanceof ast.List) ?
        v.members.map(exports.toNative) :
        v.value;
};
/**
 * checkType to ensure they match.
 */
var checkType = function (typ, value) {
    if (Array.isArray(value) && typ === 'array')
        return true;
    else if (typeof value === typ)
        return true;
    else
        false;
};
/**
 * apply a policy to a filter.
 *
 * This function will produce a Term for the filter or an error if any occurs.
 */
exports.apply = function (ctx, p, n) {
    var operator = n.operator, value = n.value;
    var field = n.field.value;
    var v = exports.toNative(value);
    if (!checkType(p.type, v))
        return either_1.left(exports.invalidFilterTypeErr({ field: field, operator: operator, value: value }, p.type));
    if (operator === 'default')
        return either_1.right(p.term(ctx, { field: field, operator: p.operators[0], value: value }));
    if (p.operators.indexOf(operator) > -1)
        return either_1.right(p.term(ctx, { field: field, operator: operator, value: value }));
    return either_1.left(exports.invalidFilterOperatorErr({ field: field, operator: operator, value: value }));
};
//# sourceMappingURL=policy.js.map