export interface Node {
    type: string;
    location: Location;
}
export interface Location {
    [key: string]: string | number;
}
export declare class Conditions {
    filters: Filter[];
    location: Location;
    type: string;
    constructor(filters: Filter[], location: Location);
}
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
export declare type Value = List | StringLiteral | BooleanLiteral | NumberLiteral;
export declare class List {
    members: Value[];
    location: Location;
    type: string;
    constructor(members: Value[], location: Location);
}
export declare class StringLiteral {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
export declare class BooleanLiteral {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
export declare class NumberLiteral {
    value: string;
    location: Location;
    type: string;
    constructor(value: string, location: Location);
}
