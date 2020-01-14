/// <reference path="../parser/parser.d.ts" />
import * as ast from '../parser/ast';
import { Except } from '@quenk/noni/lib/control/error';
import { Context } from './context';
import { FilterInfo, Term } from './term';
/**
 * defaultOptions for compilation.
 */
export declare const defaultOptions: {
    /**
     * maxFilters allowed in a query string.
     */
    maxFilters: number;
};
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
export declare const invalidFilterFieldErr: <V>({ field, operator, value }: FilterInfo<V>) => {
    field: string;
    operator: string;
    value: V;
    message: string;
};
/**
 * ast2Terms converts an AST into a graph of Terms representing a chain of
 * filters.
 */
export declare const ast2Terms: <F>(ctx: Context<F>, n: ast.Node) => Except<Term<F>>;
/**
 * source2Term transform source text to a Term chain.
 */
export declare const source2Term: <F>(ctx: Context<F>, source: string) => Except<Term<F>>;
