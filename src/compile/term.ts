/**
 * Compilation to a target platform filter invovles an intermediate step 
 * of representing Filters as Term instances.
 *
 * This representation was introduced to create a layer of abastraction so
 * that implmenting a compiler requires less boilerplate.
 */
import { Except } from '@quenk/noni/lib/control/error';
import { Value } from '@quenk/noni/lib/data/jsonx';

import { Context } from './';

/**
 * TermType
 */
export type TermType = string;

/**
 * TermConstructor are functions that produce Term instances on the compiler's
 * behalf.
 */
export type TermConstructor<T>
    = EmptyTermConstructor<T>
    | AndTermConstructor<T>
    | OrTermConstructor<T>
    | FilterTermConstructor<T>
    ;

/**
 * EmptyTermConstructor
 *
 * The EmptyTermConstructor is used to indicate the absence of any filters.
 * It is also used when the ignoreUnknownFields options is set.
 */
export type EmptyTermConstructor<T> = () => Term<T>;

/**
 * AndTermConstructor
 *
 * The AndTermConstructor provides a Term that combines two filters into a 
 * logical AND.
 */
export type AndTermConstructor<T> =
    (c: Context<T>, left: Term<T>, right: Term<T>) => Term<T>;

/**
 * OrTermConstructor
 *
 * The OrTermConstructor provides a Term that alternates between two filters
 * via a logical OR.
 *
 */
export type OrTermConstructor<T> =
    (c: Context<T>, left: Term<T>, right: Term<T>) => Term<T>;

/**
 * FilterTermConstructor type.
 *
 * The FilterTermConstructor constructs a Term for a filter to be used in a
 * query.
 */
export type FilterTermConstructor<T> =
    (c: Context<T>, filter: FilterInfo) => Term<T>;

/**
 * FilterInfo holds information about a filter while being compiled.
 */
export interface FilterInfo {

    /**
     * field the filter refers to.
     */
    field: string,

    /**
     * operator applied to the filter.
     */
    operator: string,

    /**
     * value used with the operator.
     */
    value: Value

};

/**
 * TermConstructorFactory provides functions for creating new instances of 
 * the common Terms.
 */
export interface TermConstructorFactory<T> {

    [key: string]: TermConstructor<T>

    /**
     * empty provides a new EmptyTermConstructor instance.
     */
    empty: EmptyTermConstructor<T>,

    /**
     * and provides a new AndTermConstructor instance.
     */
    and: AndTermConstructor<T>,

    /**
     * or provides a new OrTermConstructor instance.
     */
    or: OrTermConstructor<T>

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
    type: TermType

    /**
     * compile this Term into its target filter format.
     */
    compile(): Except<T>

}
