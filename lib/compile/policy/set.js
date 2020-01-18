"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var type_1 = require("@quenk/noni/lib/data/type");
/**
 * resolve a PolicyRef against a PolicySet.
 *
 * If the ref is a PolicyPointer it will be recursively resolved until a
 * match is found. If the ref is a Policy it is simply returned.
 */
exports.resolve = function (set, ref) {
    if (type_1.isString(ref)) {
        var hit = set[ref];
        while (type_1.isString(hit))
            hit = set[hit];
        return maybe_1.fromNullable(hit);
    }
    else {
        return maybe_1.just(ref);
    }
};
//# sourceMappingURL=set.js.map