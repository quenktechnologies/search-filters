/// <reference path="parser.d.ts" />
/**
 * The parse module provides the API needed to convert a query string into an
 * abstract syntax tree.
 *
 * Use these apis if you are only interested in obtaining parser information
 * from a query string.
 */
/** imports */
import * as ast from './ast';
import { Except } from '@quenk/noni/lib/control/error';
/**
 * Source text that will be used to build a filter chain.
 */
export declare type Source = string;
/**
 * parse Source text, turning it into an abstract syntax tree.
 *
 * Any errors encountered result in a Left<Err> value, success Right<Query>.
 */
export declare const parse: (source: Source) => Except<ast.Query>;
