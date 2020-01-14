/// <reference path="parser.d.ts" />
import * as ast from './ast';
import { Except } from '@quenk/noni/lib/control/error';
/**
 * Source text the filters are built from.
 */
export declare type Source = string;
/**
 * parse a Source string turning it into an abstract syntax tree.
 *
 * Any errors encountered result in a Left<Err> value, success Right<Query>.
 */
export declare const parse: (source: string) => Except<ast.Query>;
