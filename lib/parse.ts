/// <reference path='parser.d.ts' />
import * as ast from './ast';
import parser = require('./parser');
import { Except, attempt } from '@quenk/noni/lib/control/error';
import { nothing, just } from '@quenk/noni/lib/data/maybe';

/**
 * Source text type.
 */
export type Source = string;

/**
 * parse a string turning it into an AST of filters.
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
