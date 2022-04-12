"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identifier = exports.NumberLiteral = exports.BooleanLiteral = exports.StringLiteral = exports.DateTimeLiteral = exports.DateLiteral = exports.List = exports.Filter = exports.Or = exports.And = exports.Query = void 0;
/**
 * Query
 *
 * This is the main node in the AST we are interested in.
 */
var Query = /** @class */ (function () {
    function Query(terms, count, location) {
        this.terms = terms;
        this.count = count;
        this.location = location;
        this.type = 'query';
    }
    return Query;
}());
exports.Query = Query;
/**
 * And
 */
var And = /** @class */ (function () {
    function And(left, right, location) {
        this.left = left;
        this.right = right;
        this.location = location;
        this.type = 'and';
    }
    return And;
}());
exports.And = And;
/**
 * Or
 */
var Or = /** @class */ (function () {
    function Or(left, right, location) {
        this.left = left;
        this.right = right;
        this.location = location;
        this.type = 'or';
    }
    return Or;
}());
exports.Or = Or;
/**
 * Filter
 */
var Filter = /** @class */ (function () {
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
/**
 * List
 */
var List = /** @class */ (function () {
    function List(members, location) {
        this.members = members;
        this.location = location;
        this.type = 'list';
    }
    return List;
}());
exports.List = List;
/**
 * DateLiteral
 */
var DateLiteral = /** @class */ (function () {
    function DateLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'date';
    }
    return DateLiteral;
}());
exports.DateLiteral = DateLiteral;
/**
 * DateTimeLiteral
 */
var DateTimeLiteral = /** @class */ (function () {
    function DateTimeLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'datetime';
    }
    return DateTimeLiteral;
}());
exports.DateTimeLiteral = DateTimeLiteral;
/**
 * StringLiteral
 */
var StringLiteral = /** @class */ (function () {
    function StringLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'string';
    }
    return StringLiteral;
}());
exports.StringLiteral = StringLiteral;
/**
 * BooleanLiteral
 */
var BooleanLiteral = /** @class */ (function () {
    function BooleanLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'boolean-literal';
    }
    return BooleanLiteral;
}());
exports.BooleanLiteral = BooleanLiteral;
/**
 * NumberLiteral
 */
var NumberLiteral = /** @class */ (function () {
    function NumberLiteral(value, location) {
        this.value = value;
        this.location = location;
        this.type = 'number-literal';
    }
    return NumberLiteral;
}());
exports.NumberLiteral = NumberLiteral;
/**
 * Identifier
 */
var Identifier = /** @class */ (function () {
    function Identifier(value) {
        this.value = value;
        this.type = 'identifier';
    }
    return Identifier;
}());
exports.Identifier = Identifier;
//# sourceMappingURL=ast.js.map