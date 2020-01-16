/// <reference path='parser.d.ts' />

/**
 * The parser module provides the API needed to convert a query string into an
 * abstract syntax tree.
 *
 * Use these apis if you are only interested in parsing a query string.
 */
import * as ast from './ast';

import parser = require('./parser');

import { Except, attempt } from '@quenk/noni/lib/control/error';
import { nothing, just } from '@quenk/noni/lib/data/maybe';

/**
 * Source text that will be used to build a filter chain.
 */
export type Source = string;

/**
 * parse Source text, turning it into an abstract syntax tree.
 * 
 * Any errors encountered result in a Left<Err> value, success Right<Query>.
 */
export const parse = (source: Source): Except<ast.Query> =>
    attempt(() => {

        parser.parser.yy = {
            ast,
            nothing: nothing(),
            just: just,
            filterCount: 0
        };

        return parser.parser.parse(source);

    });
