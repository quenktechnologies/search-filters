import * as ast from '../parse/ast';

import { isString } from '@quenk/noni/lib/data/type';
import { left, right } from '@quenk/noni/lib/data/either';
import { Except } from '@quenk/noni/lib/control/error';
import { Value } from '@quenk/noni/lib/data/json';
import { Maybe, fromNullable } from '@quenk/noni/lib/data/maybe';

import { Term, FilterTermConstructor } from './term';
import { Context } from './';
import { UnsupportedOperatorErr, InvalidTypeErr } from './error';

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
 * PolicyRef is either a raw Policy definition or a pointer to one.
 */
export type PolicyRef<T> = Policy<T> | PolicyPointer;

/**
 * EnabledPolicies is a map of PolicyRefs where the key is a field name and
 * the value the Policy (or PolicyPointer) to be applied to that field.
 *
 * EnabledPolicies is used to determine what fields can occur in a filter chain
 * and how they can be filtered on.
 */
export interface EnabledPolicies<T> {

    [key: string]: PolicyRef<T>

}

/**
 * AvailablePolicies is a map of Policys available for PolicyPointer resolution.
 *
 * These are only used to substitute a string reference for an actual Policy.
 */
export interface AvailablePolicies<T> {

    [key: string]: Policy<T>

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
     * include "string", "number" and "date".
     */
    type: string,

    /**
     * operators is a non-empty list of filter  operators allowed.
     *
     * If the parser determines the operator is "default", the first is used.
     */
    operators: Operator[],

    /**
     * term provides a function for constructing a Term instance for the field
     * that will later be used in final stage of compilation.
     */
    term: FilterTermConstructor<T>

}

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
 * getPolicyFor will attempt to get the Policy applicable to a field.
 *
 * If the field does not have a Policy or the Policy cannot be resolve the
 * result will be an instance of Nothing.
 */
export const getPolicyFor =
    <T>(available: AvailablePolicies<T>,
        enabled: EnabledPolicies<T>,
        field: string): Maybe<Policy<T>> =>
        fromNullable(enabled[field])
            .chain(ref => resolve(available, ref));

/**
 * resolve a PolicyRef against an AvailablePolicies list to get the applicable 
 * Policy (if any).
 */
export const resolve =
    <T>(avail: AvailablePolicies<T>, ref: PolicyRef<T>): Maybe<Policy<T>> =>
        fromNullable(isString(ref) ? avail[ref] : ref);

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
        return left(new InvalidTypeErr(field, operator, value, p.type));

    if (operator === 'default')
        return right(p.term(ctx, { field, operator: p.operators[0], value }));

    if (p.operators.indexOf(operator) > -1)
        return right(p.term(ctx, { field, operator, value }));

    return left(new UnsupportedOperatorErr(field, operator, value));

}
