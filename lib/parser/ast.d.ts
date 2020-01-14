import { Maybe } from '@quenk/noni/lib/data/maybe';
/**
 * Nodes maps a key to Node constructor.
 */
export interface Nodes {
    [key: string]: Node;
}
/**
 * Node is the basic interface all members of the AST implements.
 */
export interface Node {
    /**
     * type of node.
     */
    type: string;
    /**
     * location info.
     */
    location: Location;
}
/**
 * Location provides information about where a node was found
 * in the source text.
 *
 * More information available in the Jison module.
 */
export interface Location {
    [key: string]: string | number;
}
/**
 * Query
 *
 * This is the main node
 */
export declare class Query {
    terms: Maybe<Term>;
    count: number;
    location: Location;
    type: string;
    constructor(terms: Maybe<Term>, count: number, location: Location);
}
/**
 * Term
 */
export declare type Term = Filter | And | Or;
/**
 * And
 */
export declare class And {
    left: Filter;
    right: Filter;
    location: Location;
    type: string;
    constructor(left: Filter, right: Filter, location: Location);
}
/**
 * Or
 */
export declare class Or {
    left: Filter;
    right: Filter;
    location: Location;
    type: string;
    constructor(left: Filter, right: Filter, location: Location);
}
/**
 * Filter
 */
export declare class Filter {
    field: Identifier;
    operator: string;
    value: Value;
    location: Location;
    type: string;
    constructor(field: Identifier, operator: string, value: Value, location: Location);
}
/**
 * Value
 */
export declare type Value = List | Literal;
/**
 * List
 */
export declare class List {
    members: Value[];
    location: Location;
    type: string;
    constructor(members: Value[], location: Location);
}
/**
 * Literal
 */
export declare type Literal = DateLiteral | StringLiteral | BooleanLiteral | NumberLiteral;
/**
 * DateLiteral
 */
export declare class DateLiteral {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
/**
 * StringLiteral
 */
export declare class StringLiteral {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
/**
 * BooleanLiteral
 */
export declare class BooleanLiteral {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
/**
 * NumberLiteral
 */
export declare class NumberLiteral {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
/**
 * Identifier
 */
export declare class Identifier {
    value: string;
    type: string;
    constructor(value: string);
}
