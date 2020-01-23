"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var ast = require("../parse/ast");
var type_1 = require("@quenk/noni/lib/data/type");
var either_1 = require("@quenk/noni/lib/data/either");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var error_1 = require("./error");
/**
 * toNative converts a parsed value into a JS native value.
 */
exports.toNative = function (v) {
    if (v instanceof ast.List)
        return v.members.map(exports.toNative);
    else if (v instanceof ast.DateTimeLiteral)
        return moment.utc(v.value).toDate();
    else
        return v.value;
};
/**
 * checkType to ensure they match.
 */
var checkType = function (typ, value) {
    if (Array.isArray(value) && typ === 'array')
        return true;
    else if ((typ === 'date') && (value instanceof Date))
        return true;
    else if (typeof value === typ)
        return true;
    else
        return false;
};
/**
 * getPolicyFor will attempt to get the Policy applicable to a field.
 *
 * If the field does not have a Policy or the Policy cannot be resolve the
 * result will be an instance of Nothing.
 */
exports.getPolicyFor = function (available, enabled, field) {
    return maybe_1.fromNullable(enabled[field])
        .chain(function (ref) { return exports.resolve(available, ref); });
};
/**
 * resolve a PolicyRef against an AvailablePolicies list to get the applicable
 * Policy (if any).
 */
exports.resolve = function (avail, ref) {
    return maybe_1.fromNullable(type_1.isString(ref) ? avail[ref] : ref);
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
        return either_1.left(new error_1.InvalidTypeErr(field, operator, value, p.type));
    if (operator === 'default')
        return either_1.right(p.term(ctx, { field: field, operator: p.operators[0], value: value }));
    if (p.operators.indexOf(operator) > -1)
        return either_1.right(p.term(ctx, { field: field, operator: operator, value: value }));
    return either_1.left(new error_1.UnsupportedOperatorErr(field, operator, value));
};
//# sourceMappingURL=policy.js.map