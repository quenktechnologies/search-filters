/// <reference path='../parse/parser.d.ts' />

/**
 * The compile module provides an API for building filter compilers.
 */

/** imports */
import * as ast from '../parse/ast';

import { left, right } from '@quenk/noni/lib/data/either';
import { Except } from '@quenk/noni/lib/control/error';
import { merge } from '@quenk/noni/lib/data/record';

import { Source, parse } from '../parse';
import {
    EnabledPolicies,
    AvailablePolicies,
    getPolicyFor,
    apply,
    toNative
} from './policy';
import { TermConstructorFactory, Term } from './term';
import { UnsupportedFieldErr, MaxFilterExceededErr } from './error';

export { Source, Except }

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
     * policies that can be substituted during compilation.
     *
     * Any policy value in the EnabledPolicies object that is a string will be
     * looked up here.
     */
    policies: AvailablePolicies<T>

}

/**
 * newContext creates a new Context with default policies and options
 * set.
 */
export const newContext =
    <T>(terms: TermConstructorFactory<T>,
        policies: AvailablePolicies<T> = {},
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
    <T>(
        ctx: Context<T>,
        enabled: EnabledPolicies<T>,
        node: ast.Node): Except<Term<T>> => {

        if (node instanceof ast.Query) {

            if (node.terms.isNothing())
                return <Except<Term<T>>>right(ctx.terms.empty());

            if (node.count > ctx.options.maxFilters)
                return left(new MaxFilterExceededErr(node.count,
                    ctx.options.maxFilters));

            return ast2Terms<T>(ctx, enabled, node.terms.get());

        } else if ((node instanceof ast.And) || (node instanceof ast.Or)) {

            if (ctx.options.ignoreUnknownFields) {

                let mLhs = getPolicyFor(ctx.policies, enabled,
                    node.left.field.value);

                let mRhs = getPolicyFor(ctx.policies, enabled,
                    node.right.field.value);

                if (mLhs.isNothing() || mRhs.isNothing())
                    return right(ctx.terms.empty());

            }

            let eitherL = ast2Terms<T>(ctx, enabled, node.left);

            if (eitherL.isLeft())
                return eitherL;

            let eitherR = ast2Terms<T>(ctx, enabled, node.right);

            if (eitherR.isLeft())
                return eitherR;

            let l = eitherL.takeRight();
            let r = eitherR.takeRight();

            if (node.type === 'and')
                return right(ctx.terms.and(ctx, l, r));
            else
                return right(ctx.terms.or(ctx, l, r));

        } else if (node instanceof ast.Filter) {

            let maybePolicy = getPolicyFor(ctx.policies, enabled,
                node.field.value);

            if (maybePolicy.isJust())
                return apply(ctx, maybePolicy.get(), node);

            if (ctx.options.ignoreUnknownFields === true)
                return right(ctx.terms.empty());

            let { operator } = node;
            let value = toNative(node.value);
            let field = node.field.value;

            return left(new UnsupportedFieldErr(field, operator, value));

        } else {

            return left(new Error(`Unsupported node type "${node.type}"!`));

        }

    }

/**
 * source2Term transform Source text directly into a Term chain.
 */
export const source2Term =
    <T>(
        ctx: Context<T>,
        enabled: EnabledPolicies<T>,
        src: Source): Except<Term<T>> =>
        parse(src).chain(n => ast2Terms(ctx, enabled, n));

/**
 * compile source text into a type <T> that represents a filter in the target
 * language.
 *
 * Succesful compilation depends on the fields used in the source text 
 * complying with the policies indicated in the enabled argument.
 */
export const compile =
    <T>(ctx: Context<T>, enabled: EnabledPolicies<T>, src: Source): Except<T> =>
        source2Term(ctx, enabled, src).chain(r => r.compile());
