import * as moment from 'moment';
import * as ast from '../parse/ast';

import { isString, isNumber, isBoolean } from '@quenk/noni/lib/data/type';
import { left, right } from '@quenk/noni/lib/data/either';
import { Except } from '@quenk/noni/lib/control/error';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Maybe, fromNullable } from '@quenk/noni/lib/data/maybe';

import { Operator, Term, FilterTermConstructor, FieldName } from './term';
import { UnsupportedOperatorErr, InvalidTypeErr } from './error';

export const TYPE_NUMBER = 'number';
export const TYPE_BOOLEAN = 'boolean';
export const TYPE_STRING = 'string';
export const TYPE_DATE = 'date';
export const TYPE_LIST = 'list';
export const TYPE_LIST_NUMBER = 'list-number';
export const TYPE_LIST_BOOLEAN = 'list-boolean';
export const TYPE_LIST_STRING = 'list-string';
export const TYPE_LIST_DATE = 'list-date';

/**
 * ValueType indiciates what value types are acceptable for the policy.
 *
 * Must be one of the TYPE_* constants.
 */
export type ValueType = string | string[];

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
 * EnabledPolicies is a map of PolicyRefs.
 *
 * The key is a valid field name that can be filtered on and the value is
 * a PolicyPointer or raw Policy to be applied for the field. EnabledPolicies is
 * used to determine what fields can occur in a filter chain
 * and how they can be filtered on.

 * If the value is an array, then any element of that array is considered a 
 * valid policy for the field.
 */
export interface EnabledPolicies<T> {

    [key: string]: PolicyRef<T> | PolicyRef<T>[]

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
     * are the various TYPE_* constants exported. If the value of this 
     * property is an array it is taken to mean any of these values.
     */
    type: ValueType,

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
export const toNative = (v: ast.Value): Value => {

    if (v instanceof ast.List)
        return v.members.map(toNative);
    else if (v instanceof ast.DateTimeLiteral)
        return moment.utc(v.value).toDate();
    else
        return v.value;

}

/**
 * checkType to ensure they match.
 */
const checkType = <V>(typ: ValueType, value: V): boolean => {

    if (Array.isArray(typ))
        return typ.some(t => checkType(t, value));
    else if (typ === TYPE_LIST)
        return Array.isArray(value);
    else if (typ === TYPE_LIST_NUMBER)
        return checkList(isNumber, value);
    else if (typ === TYPE_LIST_BOOLEAN)
        return checkList(isBoolean, value);
    else if (typ === TYPE_LIST_STRING)
        return checkList(isString, value);
    else if (typ === TYPE_LIST_DATE)
        return checkList(v => v instanceof Date, value);
    else if (typ === TYPE_DATE)
        return (value instanceof Date);
    else if (typeof value === typ)
        return true
    else
        return false

}

const checkList = <V>(test: (v: V) => boolean, value: V) =>
    Array.isArray(value) && value.every(test);

/**
 * getPolicies attempts to retrieve the Policy(s) applicable to a field.
 *
 * If the field does not have a Policy or the Policy cannot be resolved the
 * array will be empty.
 */
export const getPolicies =
    <T>(
        available: AvailablePolicies<T>,
        enabled: EnabledPolicies<T>,
        field: FieldName): Policy<T>[] => {

        let t = enabled[field];

        if (t == null) return [];

        return Array.isArray(t) ?
            t.reduce((p, ref) => {

                let mPolicy = resolve(available, ref);

                return mPolicy.isJust() ? p.concat(mPolicy.get()) : p;

            }, <Policy<T>[]>[]) :

            resolve(available, t)
                .map(p => [p])
                .orJust(() => [])
                .get();

    }

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
    (p: Policy<T>, n: ast.Filter): Except<Term<T>> => {

    let { operator } = n;
    let field = n.field.value;
    let value = toNative(n.value);

    if (!checkType(p.type, value))
        return left(new InvalidTypeErr(field, operator, value, p.type));

    if (operator === 'default')
        return right(p.term(field, p.operators[0], value));

    if (p.operators.indexOf(operator) > -1)
        return right(p.term(field, operator, value));

    return left(new UnsupportedOperatorErr(field, operator, value, p.operators));

}
