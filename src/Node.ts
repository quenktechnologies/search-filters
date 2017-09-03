
export interface Node {

    type: string
    location: Location

}

export interface Location {

    [key: string]: string | number

};

export class Conditions {

    type = 'conditions';

    constructor(public filters: Filter[], public location: Location) { }

}

export class Filter {

    type = 'filter';

    constructor(public field: Field, public operator: string, public value: Value, public location: Location) { }

}

export class And {

    type = 'and';

    constructor(public left: Filter, public right: Filter, public location: Location) { }

}

export class Or {

    type = 'and';

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

export class Dict {

    type = 'dict';
    constructor(public properties: KVP[], public location: Location) { }

}

export class KVP {

    type = 'kvp';

    constructor(public key: Field, public value: Value, public location: Location) { }

}


export class StringLiteral {

    type = 'string';

    constructor(public value: string, public location: Location) { }


}

export class BooleanLiteral {

    type = 'boolean-literal';

    constructor(public value: string, public location: Location) { }

}

export class NumberLiteral {

    type = 'number-literal';
    constructor(public value: string, public location: Location) { }

}

export class Field {

    type = 'field';

    constructor(public value: string, public location: Location) { }

}
