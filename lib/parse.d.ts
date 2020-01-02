/// <reference path="parser.d.ts" />
import * as ast from './ast';
import { Except } from '@quenk/noni/lib/control/error';
/**
 * Source text type.
 */
export declare type Source = string;
/**
 * parse a string turning it into an AST of filters.
 */
export declare const parse: (source: string) => Except<ast.Query>;
