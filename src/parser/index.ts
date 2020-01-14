/// <reference path='parser.d.ts' />
import * as ast from './ast';

import parser = require('./parser');

import { Except, attempt } from '@quenk/noni/lib/control/error';
import { nothing, just } from '@quenk/noni/lib/data/maybe';

/**
 * Source text the filters are built from.
 */
export type Source = string;

/**
 * parse a Source string turning it into an abstract syntax tree.
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
