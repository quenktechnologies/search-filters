import { Except } from '@quenk/noni/lib/control/error';
import { Context } from './context';
/**
 * TermConstructor are constructor functions for creating Terms.
 */
export declare type TermConstructor<F> = EmptyTermConstructor<F> | AndTermConstructor<F> | OrTermConstructor<F> | FilterTermConstructor<F>;
/**
 * EmptyTermConstructor type.
 */
export declare type EmptyTermConstructor<F> = () => Term<F>;
/**
 * AndTermConstructor type.
 */
export declare type AndTermConstructor<F> = (c: Context<F>, left: Term<F>, right: Term<F>) => Term<F>;
/**
 * OrTermConstructor term type.
 */
export declare type OrTermConstructor<F> = (c: Context<F>, left: Term<F>, right: Term<F>) => Term<F>;
/**
 * FilterTermConstructor type.
 */
export declare type FilterTermConstructor<F> = (c: Context<F>, filter: FilterInfo<any>) => Term<F>;
/**
 * FilterInfo holds information about a Filter being processed.
 */
export interface FilterInfo<V> {
    field: string;
    operator: string;
    value: V;
}
/**
 * TermConstructors is an object containing constructor
 * functions for creating supported Terms.
 */
export interface TermConstructors<F> {
    [key: string]: TermConstructor<F>;
    empty: EmptyTermConstructor<F>;
    and: AndTermConstructor<F>;
    or: OrTermConstructor<F>;
}
/**
 * Term is a chain of verticies that ultimately form the filter to be
 * used in the application.
 */
export interface Term<F> {
    /**
     * compile this Term returning it's native filter representation.
     */
    compile(): Except<F>;
}
