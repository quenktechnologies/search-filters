
export interface Node {

    type: string
    location: Location

}

export interface Location {

    [key: string]: string | number

};

export class Conditions {

    type = 'conditions';

    constructor(public conditions: Condition, public location: Location) { }

}

export type Condition
    = Filter
    | And
    | Or
    ;

export class Filter {

    type = 'filter';

    constructor(public field: string, public operator: string, public value: Value, public location: Location) { }

}

export class And {

    type = 'and';

    constructor(public left: Filter, public right: Filter, public location: Location) { }

}

export class Or {

    type = 'or';

    constructor(public left: Filter, public right: Filter, public location: Location) { }

}

export type Value
    = List
    | StringLiteral
    | BooleanLiteral
    | NumberLiteral
    ;

export class List {

    type = 'list';
    constructor(public members: Value[], public location: Location) { }

}

export class Literal {

    constructor(public value: string, public location: Location) { }

}

export class StringLiteral extends Literal {

    type = 'string';

}

export class BooleanLiteral extends Literal {

    type = 'boolean-literal';

}

export class NumberLiteral extends Literal {

    type = 'number-literal';

}
