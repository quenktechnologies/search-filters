/// <reference path='../parser.d.ts' />
import * as ast from '../ast';
import { left, right } from '@quenk/noni/lib/data/either';
import { Except } from '@quenk/noni/lib/control/error';
import { fromNullable } from '@quenk/noni/lib/data/maybe';
import { parse } from '../parse';
import { apply } from './context/policy';
import { Context } from './context';
import { FilterInfo, Term } from './term';

/**
 * defaultOptions 
 */
export const defaultOptions = {

    maxFilters: 100,

};

/**
 * Source text for parsing and compilation.
 */
export type Source = string;

/**
 * invalidFilterFieldErr invalid indicates the filter supplied is not supported.
 */
export const invalidFilterFieldErr = <V>
    ({ field, operator, value }: FilterInfo<V>) =>
    ({ field, operator, value, message: `Invalid field ${field}!` });

/**
 * ast2Terms converts an AST into a graph of verticies starting at the root node.
 */
export const ast2Terms = <F>
    (ctx: Context<F>, n: ast.Node): Except<Term<F>> => {

    if (n instanceof ast.Query) {

        if (n.terms.isNothing())
            return <Except<Term<F>>>right(ctx.terms.empty());

        return ast2Terms<F>(ctx, n.terms.get());

    } else if ((n instanceof ast.And) || (n instanceof ast.Or)) {

        let eitherL = ast2Terms<F>(ctx, n.left);

        if (eitherL.isLeft())
            return eitherL;

        let eitherR = ast2Terms<F>(ctx, n.right);

        if (eitherR.isLeft())
            return eitherR;

        let l = eitherL.takeRight();
        let r = eitherR.takeRight();

        if (n.type === 'and')
            return right(ctx.terms.and(ctx, l, r));
        else
            return right(ctx.terms.or(ctx, l, r));

    } else if (n instanceof ast.Filter) {

        let maybePolicy = fromNullable(ctx.policies[n.field.value]);

        if (maybePolicy.isJust())
            return apply(ctx, maybePolicy.get(), n);

        let { operator, value } = n;
        let field = n.field.value;

        return left(invalidFilterFieldErr({ field, operator, value }));

    } else {

        return left(new Error(`Unsupported node type "${n.type}"!`));

    }

}

/**
 * source2Term source text to a Term.
 */
export const source2Term = <F>
    (ctx: Context<F>, source: Source): Except<Term<F>> =>
    parse(source)        .chain(n => ast2Terms(ctx, n));
