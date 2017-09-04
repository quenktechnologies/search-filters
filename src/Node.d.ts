export interface Node {
    type: string;
    location: Location;
}
export interface Location {
    [key: string]: string | number;
}
export declare class Conditions {
    conditions: Condition;
    location: Location;
    type: string;
    constructor(conditions: Condition, location: Location);
}
export declare type Condition = Filter | And | Or;
export declare class Filter {
    field: string;
    operator: string;
    value: Value;
    location: Location;
    type: string;
    constructor(field: string, operator: string, value: Value, location: Location);
}
export declare class And {
    left: Filter;
    right: Filter;
    location: Location;
    type: string;
    constructor(left: Filter, right: Filter, location: Location);
}
export declare class Or {
    left: Filter;
    right: Filter;
    location: Location;
    type: string;
    constructor(left: Filter, right: Filter, location: Location);
}
export declare type Value = List | Literal;
export declare class List {
    members: Value[];
    location: Location;
    type: string;
    constructor(members: Value[], location: Location);
}
export declare class Literal {
    value: any;
    location: Location;
    constructor(value: any, location: Location);
}
export declare class StringLiteral extends Literal {
    type: string;
}
export declare class BooleanLiteral extends Literal {
    type: string;
}
export declare class NumberLiteral extends Literal {
    type: string;
}
