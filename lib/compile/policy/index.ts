import * as ast from '../../parse/ast';

import { left, right } from '@quenk/noni/lib/data/either';
import { Except } from '@quenk/noni/lib/control/error';
import { Value } from '@quenk/noni/lib/data/json';

import { Term, FilterInfo, FilterTermConstructor } from '../term';
import { Context } from '../';

/**
 * Operator
 */
export type Operator = string;

/**
 * PolicyPointer is used to indicate a Policy is defined elsewhere.
 *
 * The compiler resolves these when encountered and compilation will fail if
 * the PolicyPointer cannot be resolved.
 */
export type PolicyPointer = string;

/**
 * Policy is effectively a rule or constraint placed on a field that can be
 * filtered.
 *
 * During compilation, a Policy must exist for a field otherwise compliation
 * will either fail or omit the field depending on configuration.
 */
export interface Policy<T> {

    /**
     * type indicates what type the value should be.
     *
     * If the value does not match the type it is rejected.
     */
    type: string,

    /**
     * operators is a list of operators allowed.
     * The first is used as the default when "default" is specified.
     */
    operators: Operator[],

    /**
     * term provides a function for constructing a Term instance for the field
     * the policy is applied to.
     */
    term: FilterTermConstructor<T>

}

/**
 * invalidFilterOperatorErr indicates an invalid operator was supplied.
 */
export const invalidFilterOperatorErr =
    ({ field, operator, value }: FilterInfo) =>
        ({
            field, operator, value,
            message: `Invalid operator '${operator}' used with field '${field}'!`
        });

/**
 * invalidFilterTypeErr indicates the value used with the
 * filter is the incorrect type.
 */
export const invalidFilterTypeErr =
    ({ field, operator, value }: FilterInfo, typ: string) =>
        ({
            field,
            operator,
            value,
            message: `Invalid type '${typeof value}' for field '${field}',` +
                ` expected type of '${typ}'!`
        });

/**
 * toNative converts a parsed value into a JS native value.
 */
export const toNative = (v: ast.Value): Value =>
    (v instanceof ast.List) ?
        v.members.map(toNative) :
        v.value;

/**
 * checkType to ensure they match.
 */
const checkType = <V>(typ: string, value: V): boolean => {

    if (Array.isArray(value) && typ === 'array')
        return true
    else if (typeof value === typ)
        return true
    else
        return false

}

/**
 * apply a policy to a filter.
 *
 * This function will produce a Term for the filter or an error if any occurs.
 */
export const apply = <T>
    (ctx: Context<T>, p: Policy<T>, n: ast.Filter): Except<Term<T>> => {

    let { operator } = n;
    let field = n.field.value;
    let value = toNative(n.value);

    if (!checkType(p.type, value))
        return left(invalidFilterTypeErr({ field, operator, value }, p.type));

    if (operator === 'default')
        return right(p.term(ctx, { field, operator: p.operators[0], value }));

    if (p.operators.indexOf(operator) > -1)
        return right(p.term(ctx, { field, operator, value }));

    return left(invalidFilterOperatorErr({ field, operator, value }));

}
