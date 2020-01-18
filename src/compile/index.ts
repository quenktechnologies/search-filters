/// <reference path='../parse/parser.d.ts' />

/**
 * The compile modules provides an API for building compilers on top of
 * the library.
 */

/** imports */
import * as ast from '../parse/ast';

import { left, right } from '@quenk/noni/lib/data/either';
import { Except } from '@quenk/noni/lib/control/error';
import { merge } from '@quenk/noni/lib/data/record';

import { Source, parse } from '../parse';
import { PolicySet, resolve } from './policy/set';
import { apply, toNative } from './policy';
import { TermConstructorFactory, FilterInfo, Term } from './term';

export const DEFAULT_MAX_FILTERS = 25;

/**
 * defaultOptions for compilation.
 */
export const defaultOptions: Options = {

    maxFilters: DEFAULT_MAX_FILTERS,

    ignoreUnknownFields: false

};

/**
 * Options used during the compilation process.
 */
export interface Options {

    /**
     * maxFilters allowed in a query string.
     *
     * If this is exceeded, compilation will fail.
     */
    maxFilters: number,

    /**
     * ignoreUnknownFields if true, will cause unknown fields to be 
     * silently discarded.
     *
     * Defaults to false.
     */
    ignoreUnknownFields: boolean

}

/**
 * Context compilation takes place in.
 *
 * It specifies the options and functions etc. used to transform the parsed
 * code into a result.
 */
export interface Context<T> {

    /**
     * options used during compilation.
     */
    options: Options,

    /**
     * terms provides the common required terms.
     */
    terms: TermConstructorFactory<T>

    /**
     * policies is the PolicySet that a parsed query string must comply with
     * to compile successfully.
     */
    policies: PolicySet<T>

}

/**
 * maxFilterExceededErr constructs an Err indicating the maximum amount of
 * filters allowed has been surpassed.
 */
export const maxFilterExceededErr = (n: number, max: number) =>
    ({ n, max, message: `Max ${max} filters are allowed, got ${n}!` });

/**
 * invalidFilterFieldErr constructs an Err indicating the filter encountered
 * is not supported.
 */
export const invalidFilterFieldErr =
    ({ field, operator, value }: FilterInfo) =>
        ({ field, operator, value, message: `Invalid field ${field}!` });

/**
 * newContext creates a new Context with default policies and options set.
 */
export const newContext =
    <T>(terms: TermConstructorFactory<T>,
        policies: PolicySet<T> = {},
        opts: Partial<Options> = {}): Context<T> => ({

            options: merge(defaultOptions, opts),

            terms,

            policies

        })

/**
 * ast2Terms converts an AST into a chain of Terms each representing a filter 
 * to be applied.
 */
export const ast2Terms =
    <T>(ctx: Context<T>, n: ast.Node): Except<Term<T>> => {

        if (n instanceof ast.Query) {

            if (n.terms.isNothing())
                return <Except<Term<T>>>right(ctx.terms.empty());

            if (n.count > ctx.options.maxFilters)
                return left(maxFilterExceededErr(n.count, ctx.options.maxFilters));

            return ast2Terms<T>(ctx, n.terms.get());

        } else if ((n instanceof ast.And) || (n instanceof ast.Or)) {

            if (ctx.options.ignoreUnknownFields)
                if ((resolve(ctx.policies, n.left.field.value).isNothing()) ||
                    resolve(ctx.policies, n.right.field.value).isNothing())
                    return right(ctx.terms.empty());

            let eitherL = ast2Terms<T>(ctx, n.left);

            if (eitherL.isLeft())
                return eitherL;

            let eitherR = ast2Terms<T>(ctx, n.right);

            if (eitherR.isLeft())
                return eitherR;

            let l = eitherL.takeRight();
            let r = eitherR.takeRight();

            if (n.type === 'and')
                return right(ctx.terms.and(ctx, l, r));
            else
                return right(ctx.terms.or(ctx, l, r));

        } else if (n instanceof ast.Filter) {

            let maybePolicy = resolve(ctx.policies, n.field.value);

            if (maybePolicy.isJust())
                return apply(ctx, maybePolicy.get(), n);

            if (ctx.options.ignoreUnknownFields === true)
                return right(ctx.terms.empty());

            let { operator } = n;
            let value = toNative(n.value);
            let field = n.field.value;

            return left(invalidFilterFieldErr({ field, operator, value }));

        } else {

            return left(new Error(`Unsupported node type "${n.type}"!`));

        }

    }

/**
 * source2Term transform Source text directly into a Term chain.
 */
export const source2Term =
    <T>(ctx: Context<T>, src: Source): Except<Term<T>> =>
        parse(src).chain(n => ast2Terms(ctx, n));


/**
 * compile source text into a type <T> that represents a filter.
 */
export const compile =
    <T>(ctx: Context<T>, src: Source): Except<T> =>
        source2Term(ctx, src).chain(r => r.compile());
