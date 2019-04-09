/// <reference path="parser.d.ts" />
import * as ast from './ast';
/**
 * Source text type.
 */
export declare type Source = string;
/**
 * parse a string turning it into an AST of filters.
 */
export declare const parse: (source: string) => import("@quenk/noni/lib/data/either").Either<import("@quenk/noni/lib/control/error").Err, ast.Query>;
