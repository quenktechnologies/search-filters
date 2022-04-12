"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = void 0;
var restricted = /or|and|in|["():\[\],>=?|]/gi;
/**
 * sanitize removes problematic tokens from a string so that it's usable as the
 * value of a filter.
 *
 * Operators are removed as well as brackets and parenthesis. That means no
 * list support here.
 */
var sanitize = function (str) { return str.replace(restricted, function () { return ''; }); };
exports.sanitize = sanitize;
//# sourceMappingURL=index.js.map