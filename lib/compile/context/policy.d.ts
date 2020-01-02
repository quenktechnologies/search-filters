import * as ast from '../../ast';
import { Except } from '@quenk/noni/lib/control/error';
import { Value } from '@quenk/noni/lib/data/json';
import { Term, FilterInfo, FilterTermConstructor } from '../term';
import { Context } from './';
/**
 * Operator
 */
export declare type Operator = string;
/**
 * PRef type.
 */
export declare type PRef<F> = string | Policy<F>;
/**
 * PRefs
 */
export interface PRefs<F> {
    [key: string]: PRef<F>;
}
/**
 * Policies used during compilation.
 */
export interface Policies<F> {
    [key: string]: Policy<F>;
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
    type: string;
    /**
     * operators is a list of operators allowed.
     * The first is used as the default when 'default' is specified.
     */
    operators: Operator[];
    /**
     * term provides a function for constructing the field's term.
     */
    term: FilterTermConstructor<F>;
}
/**
 * invalidFilterOperatorErr indicates an invalid operator was supplied.
 */
export declare const invalidFilterOperatorErr: <V>({ field, operator, value }: FilterInfo<V>) => {
    field: string;
    operator: string;
    value: V;
    message: string;
};
/**
 * invalidFilterTypeErr indicates the value used with the
 * filter is the incorrect type.
 */
export declare const invalidFilterTypeErr: <V>({ field, operator, value }: FilterInfo<V>, typ: string) => {
    field: string;
    operator: string;
    value: V;
    message: string;
};
/**
 * toNative converts a parsed value into a JS native value.
 */
export declare const toNative: (v: ast.Value) => Value;
/**
 * apply a policy to a filter.
 *
 * This function will produce a Term for the filter or an error if any occurs.
 */
export declare const apply: <F>(ctx: Context<F>, p: Policy<F>, n: ast.Filter) => Except<Term<F>>;
/**
 * expand a map of PRefs into a Policies map.
 *
 * This works by expanding string PRef to values found in the provided policies
 * map. Any string reference that can't be resolved is not included in the
 * final map.
 */
export declare const expand: <F>(m: Policies<F>, target: PRefs<F>) => Policies<F>;
