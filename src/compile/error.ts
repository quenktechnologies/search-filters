import { Value } from "@quenk/noni/lib/data/jsonx";
import { Err } from '@quenk/noni/lib/control/error';

/**
 * CompileErr is used in place of Error to provide an Error classes that can be
 * checked with instanceof.
 */
export abstract class CompileErr implements Err {

    /**
     * message
     */
    abstract message: string;

    /**
     * toString displays information about the CompileErr.
     */
    toString(): string {

        return this.message;

    }

}

/**
 * MaxFilterExceedErr constructs an Err indicating the maximum amount of
 * filters allowed has been surpassed in the source string.
 *
 * @param max - The maximum number of filters allowed.
 * @param actual   - The number of filters encountered.
 */
export class MaxFilterExceededErr extends CompileErr {

    constructor(public allowed: number, public actual: number) { super(); }

    message = `Max ${this.allowed} filters are allowed, got ${this.actual}!`;

}

/**
 * UnsupportedFieldErr constructs an Err indicating a filter is using an 
 * unsupported field.
 */
export class UnsupportedFieldErr extends CompileErr {

    constructor(
        public field: string,
        public operator: string,
        public value: Value) { super(); }

    message = `Unsupported field "${this.field}" with value "${this.value}` + `
  encountered!`;

}

/**
 * UnsupportedOperatorErr indicates an unsupported operator was used on a field.
 */
export class UnsupportedOperatorErr extends CompileErr {

    constructor(
        public field: string,
        public operator: string,
        public value: Value) { super(); }

    message = `Invalid operator '${this.operator}' ` +
        `used with field '${this.field}'!`

}

/**
 * InvalidTypeErr indicates the value used with the filter is the incorrect type.
 */
export class InvalidTypeErr extends CompileErr {

    constructor(
        public field: string,
        public operator: string,
        public value: Value,
        public type: string) { super(); }

    message = `Invalid type '${typeof this.value}' for field '${this.field}',` +
        ` expected type of '${this.type}'!`

}
