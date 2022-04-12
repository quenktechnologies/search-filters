"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTypeErr = exports.UnsupportedOperatorErr = exports.UnsupportedFieldErr = exports.MaxFilterExceededErr = exports.CompileErr = void 0;
/**
 * CompileErr is used in place of Error to provide an Error classes that can be
 * checked with instanceof.
 */
var CompileErr = /** @class */ (function () {
    function CompileErr() {
    }
    /**
     * toString displays information about the CompileErr.
     */
    CompileErr.prototype.toString = function () {
        return this.message;
    };
    return CompileErr;
}());
exports.CompileErr = CompileErr;
/**
 * MaxFilterExceedErr constructs an Err indicating the maximum amount of
 * filters allowed has been surpassed in the source string.
 *
 * @param max - The maximum number of filters allowed.
 * @param actual   - The number of filters encountered.
 */
var MaxFilterExceededErr = /** @class */ (function (_super) {
    __extends(MaxFilterExceededErr, _super);
    function MaxFilterExceededErr(allowed, actual) {
        var _this = _super.call(this) || this;
        _this.allowed = allowed;
        _this.actual = actual;
        _this.message = "Max ".concat(_this.allowed, " filters are allowed, got ").concat(_this.actual, "!");
        return _this;
    }
    return MaxFilterExceededErr;
}(CompileErr));
exports.MaxFilterExceededErr = MaxFilterExceededErr;
/**
 * UnsupportedFieldErr constructs an Err indicating a filter is using an
 * unsupported field.
 */
var UnsupportedFieldErr = /** @class */ (function (_super) {
    __extends(UnsupportedFieldErr, _super);
    function UnsupportedFieldErr(field, operator, value) {
        var _this = _super.call(this) || this;
        _this.field = field;
        _this.operator = operator;
        _this.value = value;
        _this.message = "Unsupported field \"".concat(_this.field, "\" with value \"").concat(_this.value) + "\n  encountered!";
        return _this;
    }
    return UnsupportedFieldErr;
}(CompileErr));
exports.UnsupportedFieldErr = UnsupportedFieldErr;
/**
 * UnsupportedOperatorErr indicates an unsupported operator was used on a field.
 */
var UnsupportedOperatorErr = /** @class */ (function (_super) {
    __extends(UnsupportedOperatorErr, _super);
    function UnsupportedOperatorErr(field, operator, value, allowed) {
        var _this = _super.call(this) || this;
        _this.field = field;
        _this.operator = operator;
        _this.value = value;
        _this.allowed = allowed;
        _this.message = "Unsupported operator \"".concat(_this.operator, "\" ") +
            "used with field \"".concat(_this.field, "\"! Allowed operators: [").concat(_this.allowed, "].");
        return _this;
    }
    return UnsupportedOperatorErr;
}(CompileErr));
exports.UnsupportedOperatorErr = UnsupportedOperatorErr;
/**
 * InvalidTypeErr indicates the value used with the filter is the incorrect type.
 */
var InvalidTypeErr = /** @class */ (function (_super) {
    __extends(InvalidTypeErr, _super);
    function InvalidTypeErr(field, operator, value, type) {
        var _this = _super.call(this) || this;
        _this.field = field;
        _this.operator = operator;
        _this.value = value;
        _this.type = type;
        _this.message = "Invalid type '".concat(typeof _this.value, "' for field '").concat(_this.field, "',") +
            " expected type of '".concat(_this.type, "'!");
        return _this;
    }
    return InvalidTypeErr;
}(CompileErr));
exports.InvalidTypeErr = InvalidTypeErr;
//# sourceMappingURL=error.js.map