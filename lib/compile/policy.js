"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var ast = require("../parse/ast");
var type_1 = require("@quenk/noni/lib/data/type");
var either_1 = require("@quenk/noni/lib/data/either");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var error_1 = require("./error");
exports.TYPE_NUMBER = 'number';
exports.TYPE_BOOLEAN = 'boolean';
exports.TYPE_STRING = 'string';
exports.TYPE_DATE = 'date';
exports.TYPE_LIST = 'list';
exports.TYPE_LIST_NUMBER = 'list-number';
exports.TYPE_LIST_BOOLEAN = 'list-boolean';
exports.TYPE_LIST_STRING = 'list-string';
exports.TYPE_LIST_DATE = 'list-date';
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
    if (Array.isArray(typ))
        return typ.some(function (t) { return checkType(t, value); });
    else if (typ === exports.TYPE_LIST)
        return Array.isArray(value);
    else if (typ === exports.TYPE_LIST_NUMBER)
        return checkList(type_1.isNumber, value);
    else if (typ === exports.TYPE_LIST_BOOLEAN)
        return checkList(type_1.isBoolean, value);
    else if (typ === exports.TYPE_LIST_STRING)
        return checkList(type_1.isString, value);
    else if (typ === exports.TYPE_LIST_DATE)
        return checkList(function (v) { return v instanceof Date; }, value);
    else if (typ === exports.TYPE_DATE)
        return (value instanceof Date);
    else if (typeof value === typ)
        return true;
    else
        return false;
};
var checkList = function (test, value) {
    return Array.isArray(value) && value.every(test);
};
/**
 * getPolicies attempts to retrieve the Policy(s) applicable to a field.
 *
 * If the field does not have a Policy or the Policy cannot be resolved the
 * array will be empty.
 */
exports.getPolicies = function (available, enabled, field) {
    var t = enabled[field];
    if (t == null)
        return [];
    return Array.isArray(t) ?
        t.reduce(function (p, ref) {
            var mPolicy = exports.resolve(available, ref);
            return mPolicy.isJust() ? p.concat(mPolicy.get()) : p;
        }, []) :
        exports.resolve(available, t)
            .map(function (p) { return [p]; })
            .orJust(function () { return []; })
            .get();
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
exports.apply = function (p, n) {
    var operator = n.operator;
    var field = n.field.value;
    var value = exports.toNative(n.value);
    if (!checkType(p.type, value))
        return either_1.left(new error_1.InvalidTypeErr(field, operator, value, p.type));
    if (operator === 'default')
        return either_1.right(p.term(field, p.operators[0], value));
    if (p.operators.indexOf(operator) > -1)
        return either_1.right(p.term(field, operator, value));
    return either_1.left(new error_1.UnsupportedOperatorErr(field, operator, value, p.operators));
};
//# sourceMappingURL=policy.js.map