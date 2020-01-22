"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * MaxFilterExceedErr constructs an Err indicating the maximum amount of
 * filters allowed has been surpassed in the source string.
 *
 * @param max - The maximum number of filters allowed.
 * @param actual   - The number of filters encountered.
 */
var MaxFilterExceededErr = /** @class */ (function () {
    function MaxFilterExceededErr(allowed, actual) {
        this.allowed = allowed;
        this.actual = actual;
        this.message = "Max " + this.allowed + " filters are allowed, got " + this.actual + "!";
    }
    return MaxFilterExceededErr;
}());
exports.MaxFilterExceededErr = MaxFilterExceededErr;
/**
 * UnsupportedFieldErr constructs an Err indicating a filter is using an
 * unsupported field.
 */
var UnsupportedFieldErr = /** @class */ (function () {
    function UnsupportedFieldErr(field, operator, value) {
        this.field = field;
        this.operator = operator;
        this.value = value;
        this.message = "Unsupported field \"" + this.field + "\" encountered!";
    }
    /**
     * fromFilterInfo constructs an UnsupportedFiledErr from a FilterInfo.
     */
    UnsupportedFieldErr.fromFilterInfo = function (info) {
        return new UnsupportedFieldErr(info.field, info.operator, info.value);
    };
    return UnsupportedFieldErr;
}());
exports.UnsupportedFieldErr = UnsupportedFieldErr;
/**
 * UnsupportedOperatorErr indicates an unsupported operator was used on a field.
 */
var UnsupportedOperatorErr = /** @class */ (function () {
    function UnsupportedOperatorErr(field, operator, value) {
        this.field = field;
        this.operator = operator;
        this.value = value;
        this.message = "Invalid operator '" + this.operator + "' " +
            ("used with field '" + this.field + "'!");
    }
    /**
     * fromFilterInfo constructs an UnsupportedOperatorErr from a FilterInfo.
     */
    UnsupportedOperatorErr.fromFilterInfo = function (_a) {
        var field = _a.field, operator = _a.operator, value = _a.value;
        return new UnsupportedOperatorErr(field, operator, value);
    };
    return UnsupportedOperatorErr;
}());
exports.UnsupportedOperatorErr = UnsupportedOperatorErr;
/**
 * InvalidTypeErr indicates the value used with the filter is the incorrect type.
 */
var InvalidTypeErr = /** @class */ (function () {
    function InvalidTypeErr(field, operator, value, type) {
        this.field = field;
        this.operator = operator;
        this.value = value;
        this.type = type;
        this.message = "Invalid type '" + typeof this.value + "' for field '" + this.field + "'," +
            (" expected type of '" + this.type + "'!");
    }
    /**
     * fromFilterInfo constructs an InvalidTypeErr from a FilterInfo.
     */
    InvalidTypeErr.fromFilterInfo = function (_a, type) {
        var field = _a.field, operator = _a.operator, value = _a.value;
        return new InvalidTypeErr(field, operator, value, type);
    };
    return InvalidTypeErr;
}());
exports.InvalidTypeErr = InvalidTypeErr;
//# sourceMappingURL=error.js.map