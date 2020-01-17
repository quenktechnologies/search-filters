import { Maybe } from '@quenk/noni/lib/data/maybe';

/**
 * Nodes maps a key to Node constructor.
 */
export interface Nodes {

    [key: string]: Node

}

/**
 * Node is the basic interface all members of the AST implements.
 */
export interface Node {

    /**
     * type of node.
     */
    type: string

    /**
     * location info.
     */
    location: Location

}

/**
 * Location provides information about where a node was found 
 * in the source text.
 *
 * More information available in the Jison module.
 */
export interface Location {

    [key: string]: string | number

}

/**
 * Query
 *
 * This is the main node in the AST we are interested in.
 */
export class Query {

    type = 'query';

    constructor(
        public terms: Maybe<Term>,
        public count: number,
        public location: Location) { }

}

/**
 * Term
 */
export type Term
    = Filter
    | And
    | Or
    ;

/**
 * And
 */
export class And {

    type = 'and';

    constructor(
        public left: Filter,
        public right: Filter,
        public location: Location) { }

}

/**
 * Or
 */
export class Or {

    type = 'or';

    constructor(
        public left: Filter,
        public right: Filter,
        public location: Location) { }

}

/**
 * Filter
 */
export class Filter {

    type = 'filter';

    constructor(
        public field: Identifier,
        public operator: string,
        public value: Value,
        public location: Location) { }

}

/**
 * Value
 */
export type Value
    = List
    | Literal
    ;

/**
 * List
 */
export class List {

    type = 'list';

    constructor(
        public members: Value[],
        public location: Location) { }

}

/**
 * Literal 
 */
export type Literal
    = DateLiteral
    | StringLiteral
    | BooleanLiteral
    | NumberLiteral
    ;

/**
 * DateLiteral
 */
export class DateLiteral {

    type = 'date';

    constructor(
        public value: string,
        public location: Location) { }

}

/**
 * StringLiteral
 */
export class StringLiteral {

    type = 'string';

    constructor(
        public value: string,
        public location: Location) { }

}

/**
 * BooleanLiteral
 */
export class BooleanLiteral {

    type = 'boolean-literal';

    constructor(
        public value: string,
        public location: Location) { }

}

/**
 * NumberLiteral
 */
export class NumberLiteral {

    type = 'number-literal';

    constructor(
        public value: string,
        public location: Location) { }


}

/**
 * Identifier
 */
export class Identifier {

    type = 'identifier';

    constructor(public value: string) { }

}
