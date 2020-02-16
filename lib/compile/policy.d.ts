import * as ast from '../parse/ast';
import { Except } from '@quenk/noni/lib/control/error';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Operator, Term, FilterTermConstructor } from './term';
export declare const TYPE_NUMBER = "number";
export declare const TYPE_BOOLEAN = "boolean";
export declare const TYPE_STRING = "string";
export declare const TYPE_DATE = "date";
export declare const TYPE_LIST = "list";
export declare const TYPE_LIST_NUMBER = "list-number";
export declare const TYPE_LIST_BOOLEAN = "list-boolean";
export declare const TYPE_LIST_STRING = "list-string";
export declare const TYPE_LIST_DATE = "list-date";
/**
 * ValueType indiciates what value types are acceptable for the policy.
 *
 * Must be one of the TYPE_* constants.
 */
export declare type ValueType = string | string[];
/**
 * PolicyPointer is used to indicate a Policy is defined elsewhere.
 *
 * The compiler resolves these when encountered and compilation will fail if
 * the PolicyPointer cannot be resolved.
 */
export declare type PolicyPointer = string;
/**
 * PolicyRef is either a raw Policy definition or a pointer to one.
 */
export declare type PolicyRef<T> = Policy<T> | PolicyPointer;
/**
 * EnabledPolicies is a map of PolicyRefs where the key is a field name and
 * the value the Policy (or PolicyPointer) to be applied to that field.
 *
 * EnabledPolicies is used to determine what fields can occur in a filter chain
 * and how they can be filtered on.
 */
export interface EnabledPolicies<T> {
    [key: string]: PolicyRef<T>;
}
/**
 * AvailablePolicies is a map of Policys available for PolicyPointer resolution.
 *
 * These are only used to substitute a string reference for an actual Policy.
 */
export interface AvailablePolicies<T> {
    [key: string]: Policy<T>;
}
/**
 * Policy is effectively a rule or constraint placed on a field that can be
 * filtered on.
 *
 * During compilation, a Policy must exist for a field otherwise compliation
 * will fail or omit the field from the chain entirely.
 */
export interface Policy<T> {
    /**
     * type indicates what ECMAScript type the value should be.
     *
     * If the value does not match the type, it is rejected. Valid values
     * are the various TYPE_* constants exported. If the value of this
     * property is an array it is taken to mean any of these values.
     */
    type: ValueType;
    /**
     * operators is a non-empty list of filter  operators allowed.
     *
     * If the parser determines the operator is "default", the first is used.
     */
    operators: Operator[];
    /**
     * term provides a function for constructing a Term instance for the field
     * that will later be used in final stage of compilation.
     */
    term: FilterTermConstructor<T>;
}
/**
 * toNative converts a parsed value into a JS native value.
 */
export declare const toNative: (v: ast.Value) => Value;
/**
 * getPolicyFor will attempt to get the Policy applicable to a field.
 *
 * If the field does not have a Policy or the Policy cannot be resolve the
 * result will be an instance of Nothing.
 */
export declare const getPolicyFor: <T>(available: AvailablePolicies<T>, enabled: EnabledPolicies<T>, field: string) => Maybe<Policy<T>>;
/**
 * resolve a PolicyRef against an AvailablePolicies list to get the applicable
 * Policy (if any).
 */
export declare const resolve: <T>(avail: AvailablePolicies<T>, ref: PolicyRef<T>) => Maybe<Policy<T>>;
/**
 * apply a policy to a filter.
 *
 * This function will produce a Term for the filter or an error if any occurs.
 */
export declare const apply: <T>(p: Policy<T>, n: ast.Filter) => Except<Term<T>>;
