import * as ast from '../../ast';
import { left, right } from '@quenk/noni/lib/data/either';
import { Except } from '@quenk/noni/lib/control/error';
import { Value } from '@quenk/noni/lib/data/json';
import { Term, FilterInfo, FilterTermConstructor } from '../term';
import { Context } from './';

/**
 * Operator
 */
export type Operator = string;

/**
 * Policies used during compilation.
 */
export interface Policies<F> {

    [key: string]: Policy<F>

}

/**
 * Policy sets out the rules applied to filters that have been parsed.
 */
export interface Policy<F> {

    /**
     * type indicates what JS type the value should be.
     *
     * If the value does not match the type it is rejected.
     */
    type: string,

    /**
     * operators is a list of operators allowed.
     * The first is used as the default when 'default' is specified.
     */
    operators: Operator[],

    /**
     * term provides a function for constructing the field's term.
     */
    term: FilterTermConstructor<F>

}

/**
 * maxFilterExceededErr indicates the maximum amount of filters allowed
 * has been surpassed.
 */
export const maxFilterExceededErr = (n: number, max: number) =>
    ({ n, max, message: `Max ${max} filters are allowed, got ${n}!` });

/**
 * invalidFilterOperatorErr indicates an invalid operator was supplied.
 */
export const invalidFilterOperatorErr = <V>
    ({ field, operator, value }: FilterInfo<V>) =>
    ({
        field, operator, value,
        message: `Invalid operator '${operator}' used with field '${field}'!`
    });

/**
 * invalidFilterTypeErr indicates the value used with the
 * filter is the incorrect type.
 */
export const invalidFilterTypeErr = <V>
    ({ field, operator, value }: FilterInfo<V>, typ: string) =>
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
        false

}

/**
 * apply a policy to a filter.
 *
 * This function will produce a Term for the filter or an error if any occurs.
 */
export const apply = <F>
    (ctx: Context<F>, p: Policy<F>, n: ast.Filter): Except<Term<F>> => {

    let { operator, value } = n;
    let field = n.field.value;

    let v = toNative(value);

    if (!checkType(p.type, v))
        return left(invalidFilterTypeErr({ field, operator, value },
            p.type));

    if (operator === 'default')
        return right(p.term(ctx, { field, operator: p.operators[0], value }));

    if (p.operators.indexOf(operator) > -1)
        return right(p.term(ctx, { field, operator, value }));

    return left(invalidFilterOperatorErr({ field, operator, value }));

}
