"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
;
var Conditions = (function () {
    function Conditions(conditions, location) {
        this.conditions = conditions;
        this.location = location;
        this.type = 'conditions';
    }
    return Conditions;
}());
exports.Conditions = Conditions;
var Filter = (function () {
    function Filter(field, operator, value, location) {
        this.field = field;
        this.operator = operator;
        this.value = value;
        this.location = location;
        this.type = 'filter';
    }
    return Filter;
}());
exports.Filter = Filter;
var And = (function () {
    function And(left, right, location) {
        this.left = left;
        this.right = right;
        this.location = location;
        this.type = 'and';
    }
    return And;
}());
exports.And = And;
var Or = (function () {
    function Or(left, right, location) {
        this.left = left;
        this.right = right;
        this.location = location;
        this.type = 'or';
    }
    return Or;
}());
exports.Or = Or;
var List = (function () {
    function List(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'list';
    }
    return List;
}());
exports.List = List;
var Literal = (function () {
    function Literal(value, location) {
        this.value = value;
        this.location = location;
    }
    return Literal;
}());
exports.Literal = Literal;
var StringLiteral = (function (_super) {
    __extends(StringLiteral, _super);
    function StringLiteral() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'string';
        return _this;
    }
    return StringLiteral;
}(Literal));
exports.StringLiteral = StringLiteral;
var BooleanLiteral = (function (_super) {
    __extends(BooleanLiteral, _super);
    function BooleanLiteral() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'boolean-literal';
        return _this;
    }
    return BooleanLiteral;
}(Literal));
exports.BooleanLiteral = BooleanLiteral;
var NumberLiteral = (function (_super) {
    __extends(NumberLiteral, _super);
    function NumberLiteral() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'number-literal';
        return _this;
    }
    return NumberLiteral;
}(Literal));
exports.NumberLiteral = NumberLiteral;
//# sourceMappingURL=Node.js.map