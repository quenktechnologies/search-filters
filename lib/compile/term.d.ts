/**
 * Compilation to a target platform filter invovles an intermediate step
 * of representing Filters as Term instances.
 *
 * This representation was introduced to create a layer of abastraction so
 * that implmenting a compiler requires less boilerplate.
 */
import { Except } from '@quenk/noni/lib/control/error';
import { Value } from '@quenk/noni/lib/data/jsonx';
/**
 * TermType
 */
export declare type TermType = string;
/**
 * FieldName
 */
export declare type FieldName = string;
/**
 * Operator
 */
export declare type Operator = string;
/**
 * FilterTermConstructor type.
 *
 * The FilterTermConstructor constructs a Term for a filter to be used in a
 * query.
 */
export declare type FilterTermConstructor<T> = (field: FieldName, op: Operator, value: Value) => Term<T>;
/**
 * FilterInfo holds information about a filter while being compiled.
 */
export interface FilterInfo {
    /**
     * field the filter refers to.
     */
    field: FieldName;
    /**
     * operator applied to the filter.
     */
    operator: Operator;
    /**
     * value used with the operator.
     */
    value: Value;
}
/**
 * TermFactory provides functions for creating new instances of
 * the common Terms.
 */
export interface TermFactory<T> {
    /**
     * empty Term constructor.
     */
    empty(): Term<T>;
    /**
     * and Term constructor.
     */
    and(left: Term<T>, right: Term<T>): Term<T>;
    /**
     * or Term constructor.
     */
    or(left: Term<T>, right: Term<T>): Term<T>;
}
/**
 * Term is an intermediate representation of a filter (or chain of filters)
 * before it is compiled to its final form.
 */
export interface Term<T> {
    /**
     * type of the Term.
     *
     * This property can be used by compilers for optimisation etc.
     */
    type: TermType;
    /**
     * compile this Term into its target filter format.
     */
    compile(): Except<T>;
}
