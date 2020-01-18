/// <reference path="../parse/parser.d.ts" />
/**
 * The compile modules provides an API for building compilers on top of
 * the library.
 */
/** imports */
import * as ast from '../parse/ast';
import { Except } from '@quenk/noni/lib/control/error';
import { PolicySet } from './policy/set';
import { TermConstructorFactory, FilterInfo, Term } from './term';
export declare const DEFAULT_MAX_FILTERS = 25;
/**
 * defaultOptions for compilation.
 */
export declare const defaultOptions: Options;
/**
 * Options used during the compilation process.
 */
export interface Options {
    /**
     * maxFilters allowed in a query string.
     *
     * If this is exceeded, compilation will fail.
     */
    maxFilters: number;
    /**
     * ignoreUnknownFields if true, will cause unknown fields to be
     * silently discarded.
     *
     * Defaults to false.
     */
    ignoreUnknownFields: boolean;
}
/**
 * Context compilation takes place in.
 *
 * It specifies the options and functions etc. used to transform the parsed
 * code into a result.
 */
export interface Context<T> {
    /**
     * options used during compilation.
     */
    options: Options;
    /**
     * terms provides the common required terms.
     */
    terms: TermConstructorFactory<T>;
    /**
     * policies is the PolicySet that a parsed query string must comply with
     * to compile successfully.
     */
    policies: PolicySet<T>;
}
/**
 * maxFilterExceededErr constructs an Err indicating the maximum amount of
 * filters allowed has been surpassed.
 */
export declare const maxFilterExceededErr: (n: number, max: number) => {
    n: number;
    max: number;
    message: string;
};
/**
 * invalidFilterFieldErr constructs an Err indicating the filter encountered
 * is not supported.
 */
export declare const invalidFilterFieldErr: ({ field, operator, value }: FilterInfo) => {
    field: string;
    operator: string;
    value: import("@quenk/noni/lib/data/json").Value;
    message: string;
};
/**
 * newContext creates a new Context with default policies and options set.
 */
export declare const newContext: <T>(terms: TermConstructorFactory<T>, policies?: PolicySet<T>, opts?: Partial<Options>) => Context<T>;
/**
 * ast2Terms converts an AST into a chain of Terms each representing a filter
 * to be applied.
 */
export declare const ast2Terms: <T>(ctx: Context<T>, n: ast.Node) => Except<Term<T>>;
/**
 * source2Term transform Source text directly into a Term chain.
 */
export declare const source2Term: <T>(ctx: Context<T>, src: string) => Except<Term<T>>;
/**
 * compile source text into a type <T> that represents a filter.
 */
export declare const compile: <T>(ctx: Context<T>, src: string) => Except<T>;
