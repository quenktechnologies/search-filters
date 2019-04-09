/// <reference path="../parser.d.ts" />
import * as ast from '../ast';
import { Context } from './context';
import { FilterInfo, Term } from './term';
/**
 * defaultOptions
 */
export declare const defaultOptions: {
    maxFilters: number;
};
/**
 * Source text for parsing and compilation.
 */
export declare type Source = string;
/**
 * maxFilterExceededErr indicates the maximum amount of filters allowed
 * has been surpassed.
 */
export declare const maxFilterExceededErr: (n: number, max: number) => {
    n: number;
    max: number;
    message: string;
};
/**
 * invalidFilterFieldErr invalid indicates the filter supplied is not supported.
 */
export declare const invalidFilterFieldErr: <V>({ field, operator, value }: FilterInfo<V>) => {
    field: string;
    operator: string;
    value: V;
    message: string;
};
/**
 * ast2Terms converts an AST into a graph of verticies starting at the root node.
 */
export declare const ast2Terms: <F>(ctx: Context<F>, n: ast.Node) => import("@quenk/noni/lib/data/either").Either<import("@quenk/noni/lib/control/error").Err, Term<F>>;
/**
 * source2Term source text to a Term.
 */
export declare const source2Term: <F>(ctx: Context<F>, source: string) => import("@quenk/noni/lib/data/either").Either<import("@quenk/noni/lib/control/error").Err, Term<F>>;
