"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.resolve = exports.getPolicies = exports.toNative = exports.TYPE_LIST_DATETIME = exports.TYPE_LIST_DATE = exports.TYPE_LIST_STRING = exports.TYPE_LIST_BOOLEAN = exports.TYPE_LIST_NUMBER = exports.TYPE_LIST = exports.TYPE_DATE_TIME = exports.TYPE_DATE = exports.TYPE_STRING = exports.TYPE_BOOLEAN = exports.TYPE_NUMBER = void 0;
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
exports.TYPE_DATE_TIME = 'datetime';
exports.TYPE_LIST = 'list';
exports.TYPE_LIST_NUMBER = 'list-number';
exports.TYPE_LIST_BOOLEAN = 'list-boolean';
exports.TYPE_LIST_STRING = 'list-string';
exports.TYPE_LIST_DATE = 'list-date';
exports.TYPE_LIST_DATETIME = 'list-datetime';
/**
 * toNative converts a parsed value into a JS native value.
 */
var toNative = function (v) {
    if (v instanceof ast.List)
        return v.members.map(exports.toNative);
    else if ((v instanceof ast.DateLiteral) || (v instanceof ast.DateTimeLiteral))
        return moment.utc(v.value).toDate();
    else
        return v.value;
};
exports.toNative = toNative;
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
    else if ((typ === exports.TYPE_LIST_DATE) || (typ === exports.TYPE_LIST_DATETIME))
        return checkList(function (v) { return v instanceof Date; }, value);
    else if ((typ === exports.TYPE_DATE) || (typ === exports.TYPE_DATE_TIME))
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
var getPolicies = function (available, enabled, field) {
    var t = enabled[field];
    if (t == null)
        return [];
    return Array.isArray(t) ?
        t.reduce(function (p, ref) {
            var mPolicy = (0, exports.resolve)(available, ref);
            return mPolicy.isJust() ? p.concat(mPolicy.get()) : p;
        }, []) :
        (0, exports.resolve)(available, t)
            .map(function (p) { return [p]; })
            .orJust(function () { return []; })
            .get();
};
exports.getPolicies = getPolicies;
/**
 * resolve a PolicyRef against an AvailablePolicies list to get the applicable
 * Policy (if any).
 */
var resolve = function (avail, ref) {
    return (0, maybe_1.fromNullable)((0, type_1.isString)(ref) ? avail[ref] : ref);
};
exports.resolve = resolve;
/**
 * apply a policy to a filter.
 *
 * This function will produce a Term for the filter or an error if any occurs.
 */
var apply = function (p, n) {
    var operator = n.operator;
    var field = n.field.value;
    var value = (0, exports.toNative)(n.value);
    if (!checkType(p.type, value))
        return (0, either_1.left)(new error_1.InvalidTypeErr(field, operator, value, p.type));
    if (operator === 'default')
        return (0, either_1.right)(p.term(field, p.operators[0], value));
    if (p.operators.indexOf(operator) > -1)
        return (0, either_1.right)(p.term(field, operator, value));
    return (0, either_1.left)(new error_1.UnsupportedOperatorErr(field, operator, value, p.operators));
};
exports.apply = apply;
//# sourceMappingURL=policy.js.map