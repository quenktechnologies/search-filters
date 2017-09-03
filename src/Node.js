"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var Conditions = (function () {
    function Conditions(filters, location) {
        this.filters = filters;
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
        this.type = 'and';
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
var Dict = (function () {
    function Dict(properties, location) {
        this.properties = properties;
        this.location = location;
        this.type = 'dict';
    }
    return Dict;
}());
exports.Dict = Dict;
var KVP = (function () {
    function KVP(key, value, location) {
        this.key = key;
        this.value = value;
        this.location = location;
        this.type = 'kvp';
    }
    return KVP;
}());
exports.KVP = KVP;
var StringLiteral = (function () {
    function StringLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'string';
    }
    return StringLiteral;
}());
exports.StringLiteral = StringLiteral;
var BooleanLiteral = (function () {
    function BooleanLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'boolean-literal';
    }
    return BooleanLiteral;
}());
exports.BooleanLiteral = BooleanLiteral;
var NumberLiteral = (function () {
    function NumberLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'number-literal';
    }
    return NumberLiteral;
}());
exports.NumberLiteral = NumberLiteral;
var Field = (function () {
    function Field(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'field';
    }
    return Field;
}());
exports.Field = Field;
//# sourceMappingURL=Node.js.map