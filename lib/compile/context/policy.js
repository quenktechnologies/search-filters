"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast = require("../../ast");
var either_1 = require("@quenk/noni/lib/data/either");
var record_1 = require("@quenk/noni/lib/data/record");
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
        return false;
};
/**
 * apply a policy to a filter.
 *
 * This function will produce a Term for the filter or an error if any occurs.
 */
exports.apply = function (ctx, p, n) {
    var operator = n.operator;
    var field = n.field.value;
    var value = exports.toNative(n.value);
    if (!checkType(p.type, value))
        return either_1.left(exports.invalidFilterTypeErr({ field: field, operator: operator, value: value }, p.type));
    if (operator === 'default')
        return either_1.right(p.term(ctx, { field: field, operator: p.operators[0], value: value }));
    if (p.operators.indexOf(operator) > -1)
        return either_1.right(p.term(ctx, { field: field, operator: operator, value: value }));
    return either_1.left(exports.invalidFilterOperatorErr({ field: field, operator: operator, value: value }));
};
/**
 * expand a map of PRefs into a Policies map.
 *
 * This works by expanding string PRef to values found in the provided policies
 * map. Any string reference that can't be resolved is not included in the
 * final map.
 */
exports.expand = function (m, target) {
    return record_1.reduce(target, {}, function (p, c, k) {
        var _a, _b;
        if (typeof c === 'string') {
            if (m[c])
                return record_1.merge(p, (_a = {}, _a[k] = m[c], _a));
            else
                return p;
        }
        else {
            return record_1.merge(p, (_b = {}, _b[k] = c, _b));
        }
    });
};
//# sourceMappingURL=policy.js.map