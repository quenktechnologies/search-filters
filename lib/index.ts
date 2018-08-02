/// <reference path='Parser.d.ts' />
import * as ast from './ast';
import Parser = require('./Parser');
import { match } from '@quenk/match';
import { Either, left, right } from 'afpl/lib/monad/Either';
import { Maybe } from 'afpl/lib/monad/Maybe';

/**
 * defaultOptions 
 */
export const defaultOptions = {

    maxFilters: 100,

};

type AndOr = ast.And | ast.Or;

/**
 * TermConsMap is an object containing constructor
 * functions for creating supported Terms.
 */
export interface TermConsMap<F> {

    [key: string]: TermCons<F>

    empty: EmptyTermCons<F>,

    and: AndTermCons<F>,

    or: OrTermCons<F>

}

/**
 * TermCons are constructor functions for creating Terms.
 */
export type TermCons<F>
    = EmptyTermCons<F>
    | AndTermCons<F>
    | OrTermCons<F>
    | FilterTermCons<F>
    ;

/**
 * EmptyTermCons provides the empty unit.
 */
export type EmptyTermCons<F> = () => Term<F>;

/**
 * AndTermCons provides the unit for compiling 'and' expressions.
 */
export type AndTermCons<F> =
    (c: Context<F>) => (left: Term<F>) => (right: Term<F>) => Term<F>;

/**
 * OrTermCons provides the unit for compiling 'or' expressions. 
 */
export type OrTermCons<F> =
    (c: Context<F>) => (left: Term<F>) => (right: Term<F>) => Term<F>;

/**
 * FilterTermCons is a function that constructs a new Term for compiling a filter.
 */
export type FilterTermCons<F> =
    (c: Context<F>) => (filter: FilterSpec<any>) => Term<F>;

/**
 * FilterSpec holds information about a Filter being processed.
 */
export interface FilterSpec<V> { field: string, operator: string, value: V };

/**
 * Context represents the context the compilation
 * takes place in.
 *
 * It specifies the options and functions required to complete
 * the transformation process.
 *
 */
export interface Context<F> {

    /**
     * options for compilation.
     */
    options: Options,

    /**
     * terms map of constructors.
     */
    terms: TermConsMap<F>

    /**
     * policies that can be defined via strings.
     * each field allowed.
     */
    policies: PolicyMap<F>

}

/**
 * PolicyMap maps a string to a policy.
 */
export interface PolicyMap<F> {

    [key: string]: Policy<F>

}

/**
 * Policies used during compilation.
 */
export interface Policies<F> {

    [key: string]: PolicySpec<F>

}

/**
 * PolicySpec 
 */
export type PolicySpec<F> = string | Policy<F>;

/**
 * Policy provides information relating to how a filter should 
 * be treated after parsing.
 */
export interface Policy<F> {

    /**
     * type indicates what JS type the value should be.
     *
     * If the value does not match the type it is rejected.
     */
    type: string,

    /**
     * operators is a list of operators allowed.
     * The first is used as the default when 'default' is specified.
     */
    operators: Operator[],

    /**
     * term provides a function for constructing the field's term.
     */
    term: FilterTermCons<F>

}

/**
 * Operator for the filter condition.
 */
export type Operator = string;

/**
 * Source text for parsing and compilation.
 */
export type Source = string;

/**
 * Options used during the compilation process.
 */
export interface Options {

    [key: string]: any

    /**
     * maxFilters allowed to specified in the source.
     */
    maxFilters?: number

}

/**
 * Term is a chain of verticies that ultimately form the filter to be 
 * used in the application.
 */
export interface Term<F> {

    /**
     * compile this Term returning it's native filter representation.
     */
    compile(): Either<Err, F>

}

/**
 * Err indicates something went wrong.
 */
export interface Err {

    /**
     * message of the error.
     */
    message: string

}

/**
 * FilterErr 
 */
export interface FilterErr<V> extends Err {

    /**
     * field the filter applies to.
     */
    field: string,

    /**
     * operator used.
     */
    operator: string,

    /**
     * value used.
     */
    value: V

}

/**
 * maxFilterExceededErr indicates the maximum amount of filters allowed
 * has been surpassed.
 */
export const maxFilterExceededErr = (n: number, max: number) =>
    ({ n, max, message: `Max ${max} filters are allowed, got ${n}!` });

/**
 * invalidFilterFieldErr invalid indicates the filter supplied is not supported.
 */
export const invalidFilterFieldErr = <V>({ field, operator, value }: FilterSpec<V>) =>
    ({ field, operator, value, message: `Invalid field ${field}!` });

/**
 * invalidFilterOperatorErr indicates an invalid operator was supplied.
 */
export const invalidFilterOperatorErr = <V>({ field, operator, value }: FilterSpec<V>) =>
    ({ field, operator, value, message: `Invalid operator '${operator}' used with field '${field}'!` });

/**
 * invalidFilterTypeErr indicates the value used with the filter is the incorrect type.
 */
export const invalidFilterTypeErr = <V>({ field, operator, value }: FilterSpec<V>, typ: string) =>
    ({
        field,
        operator,
        value,
        message: `Invalid type '${typeof value}' for field '${field}', expected type of '${typ}'!`
    });

/**
 * checkType to ensure they match.
 */
const checkType = <V>(typ: string, value: V): boolean =>
    (Array.isArray(value) && typ === 'array') ? true :
        (typeof value === typ) ? true : false

/**
 * count the number of filters in the AST.
 */
export const count = (n: ast.Node): number => match<number>(n)
    .caseOf(ast.And, (n: ast.And) => count(n.left) + count(n.right))
    .caseOf(ast.Or, (n: ast.Or) => count(n.left) + count(n.right))
    .caseOf(ast.Filter, () => 1)
    .orElse(() => 0)
    .end();

/**
 * ensureFilterLimit prevents abuse via excessively long queries.
 */
export const ensureFilterLimit = (n: ast.Condition, max: number)
    : Either<Err, ast.Condition> =>
    (max <= 0) ?
        Either
            .right<Err, ast.Condition>(n) :
        Either
            .right<Err, number>(count(n))
            .chain(c => (c > max) ?
                Either
                    .left<Err, ast.Condition>(maxFilterExceededErr(c, max)) :
                Either
                    .right<Err, ast.Condition>(n));
/**
 * value2JS converts a parseed value node into a JS value.
 */
export const value2JS = <J>(v: ast.Value): J => match(v)
    .caseOf(ast.List, ({ members }: ast.List) => members.map(value2JS))
    .caseOf(ast.Literal, ({ value }: ast.Literal) => value)
    .end();

/**
 * parse a string turning it into an Abstract Syntax Tree.
 */
export const parse = (ast: ast.Nodes) => (source: Source): Either<Err, ast.Conditions> => {

    try {
        Parser.parser.yy = { ast };
        return right<Err, ast.Conditions>(Parser.parser.parse(source));
    } catch (e) {

        return left<Err, ast.Conditions>(e);

    }
}

export const parse$ = parse(<any>ast);

/**
 * ast2Terms converts an AST into a graph of verticies starting at the root node.
 */
export const ast2Terms = <F>(ctx: Context<F>) => (policies: Policies<F>) => (n: ast.Node)
    : Either<Err, Term<F>> =>
    match<Either<Err, Term<F>>>(n)
        .caseOf(ast.Conditions, parseRoot<F>(ctx)(policies))
        .caseOf(ast.Filter, parseFilter<F>(ctx)(policies))
        .caseOf(ast.And, parseAndOr<F>(ctx)(policies))
        .caseOf(ast.Or, parseAndOr<F>(ctx)(policies))
        .orElse(() => Either.left<Err, Term<F>>({ message: `Unsupported node type ${n.type}!` }))
        .end();

const parseRoot = <F>(ctx: Context<F>) => (policies: Policies<F>) => (n: ast.Conditions) =>
    Maybe
        .fromAny(n.conditions)
        .map((c: ast.Condition) =>
            ensureFilterLimit(c, ctx.options.maxFilters)
                .chain(c => ast2Terms<F>(ctx)(policies)(c)))
        .orJust(() => right<Err, Term<F>>(ctx.terms.empty()))
        .get();

const parseAndOr = <F>(ctx: Context<F>) => (policies: Policies<F>) => (n: AndOr)
    : Either<Err, Term<F>> =>
    (ast2Terms<F>(ctx)(policies)(n.left))
        .chain(lv =>
            (ast2Terms<F>(ctx)(policies)(n.right))
                .map(rv => match<Term<F>>(n)
                    .caseOf(ast.And, () => ctx.terms.and(ctx)(lv)(rv))
                    .caseOf(ast.Or, () => ctx.terms.or(ctx)(lv)(rv))
                    .end()));

const parseFilter = <F>(ctx: Context<F>) => (policies: Policies<F>) => ({ field, operator, value }: ast.Filter)
    : Either<Err, Term<F>> =>
    Maybe
        .fromAny(value2JS(value))
        .chain(<V>(value: V) =>
            Maybe
                .fromAny(policies[field])
                .chain(resolvePolicy(ctx.policies))
                .map((p: Policy<F>): Either<Err, Term<F>> =>
                    !checkType(p.type, value) ?
                        left<Err, Term<F>>(invalidFilterTypeErr({ field, operator, value }, p.type)) :
                        (operator === 'default') ?
                            right<Err, Term<F>>((p.term(ctx)({ field, operator: p.operators[0], value }))) :
                            (p.operators.indexOf(operator) > -1) ?
                                right<Err, Term<F>>(p.term(ctx)({ field, operator, value })) :
                                left<Err, Term<F>>(invalidFilterOperatorErr<V>({ field, operator, value })))
                .orJust(() => left<Err, Term<F>>(invalidFilterFieldErr<V>({ field, operator, value }))))
        .get();

const resolvePolicy = <F>(available: PolicyMap<F>) => (specified: PolicySpec<F>)
    : Maybe<Policy<F>> =>
    Maybe
        .fromBoolean((typeof specified === 'string'))
        .chain(() => Maybe.fromAny(available[<string>specified]))
        .orJust(() => <Policy<F>>specified);

/**
 * source2Term source text to a Term.
 */
export const source2Term = <F>(ctx: Context<F>) => (policies: Policies<F>) => (source: Source)
    : Either<Err, Term<F>> =>
    parse$(source)
        .chain(ast2Terms(ctx)(policies));

/**
 * compile a string into a usable string of filters.
 */
export const compile = <F>(terms: TermConsMap<F>) => (policies: PolicyMap<F>) => (options: Options) =>
    (p: Policies<F>) => (source: Source): Either<Err, F> =>
        (source2Term<F>({ terms, policies, options })(p)(source))
            .chain((v: Term<F>) => v.compile());
