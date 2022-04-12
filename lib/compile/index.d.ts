/// <reference path="../parse/parser.d.ts" />
/**
 * The compile module provides an API for building filter compilers.
 */
/** imports */
import * as ast from '../parse/ast';
import { Except } from '@quenk/noni/lib/control/error';
import { Source } from '../parse';
import { EnabledPolicies, AvailablePolicies } from './policy';
import { TermFactory, Term } from './term';
export { Source, Except };
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
    terms: TermFactory<T>;
    /**
     * policies that can be substituted during compilation.
     *
     * Any policy value in the EnabledPolicies object that is a string will be
     * looked up here.
     */
    policies: AvailablePolicies<T>;
}
/**
 * newContext creates a new Context with default policies and options
 * set.
 */
export declare const newContext: <T>(terms: TermFactory<T>, policies?: AvailablePolicies<T>, opts?: Partial<Options>) => Context<T>;
/**
 * ast2Terms converts an AST into a chain of Terms each representing a filter
 * to be applied.
 */
export declare const ast2Terms: <T>(ctx: Context<T>, enabled: EnabledPolicies<T>, node: ast.Node) => Except<Term<T>>;
/**
 * source2Term transform Source text directly into a Term chain.
 */
export declare const source2Term: <T>(ctx: Context<T>, enabled: EnabledPolicies<T>, src: Source) => Except<Term<T>>;
/**
 * compile source text into a type <T> that represents a filter in the target
 * language.
 *
 * Succesful compilation depends on the fields used in the source text
 * complying with the policies indicated in the enabled argument.
 */
export declare const compile: <T>(ctx: Context<T>, enabled: EnabledPolicies<T>, src: Source) => Except<T>;
