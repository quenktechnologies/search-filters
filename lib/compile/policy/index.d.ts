import * as ast from '../../parse/ast';
import { Except } from '@quenk/noni/lib/control/error';
import { Value } from '@quenk/noni/lib/data/json';
import { Term, FilterInfo, FilterTermConstructor } from '../term';
import { Context } from '../';
/**
 * Operator
 */
export declare type Operator = string;
/**
 * PolicyPointer is used to indicate a Policy is defined elsewhere.
 *
 * The compiler resolves these when encountered and compilation will fail if
 * the PolicyPointer cannot be resolved.
 */
export declare type PolicyPointer = string;
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
    type: string;
    /**
     * operators is a list of operators allowed.
     * The first is used as the default when "default" is specified.
     */
    operators: Operator[];
    /**
     * term provides a function for constructing a Term instance for the field
     * the policy is applied to.
     */
    term: FilterTermConstructor<T>;
}
/**
 * invalidFilterOperatorErr indicates an invalid operator was supplied.
 */
export declare const invalidFilterOperatorErr: ({ field, operator, value }: FilterInfo) => {
    field: string;
    operator: string;
    value: Value;
    message: string;
};
/**
 * invalidFilterTypeErr indicates the value used with the
 * filter is the incorrect type.
 */
export declare const invalidFilterTypeErr: ({ field, operator, value }: FilterInfo, typ: string) => {
    field: string;
    operator: string;
    value: Value;
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
export declare const apply: <T>(ctx: Context<T>, p: Policy<T>, n: ast.Filter) => Except<Term<T>>;
