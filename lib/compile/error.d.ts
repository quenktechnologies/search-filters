import { Value } from "@quenk/noni/lib/data/jsonx";
import { Err } from '@quenk/noni/lib/control/error';
/**
 * CompileErr is used in place of Error to provide an Error classes that can be
 * checked with instanceof.
 */
export declare abstract class CompileErr implements Err {
    /**
     * message
     */
    abstract message: string;
    /**
     * toString displays information about the CompileErr.
     */
    toString(): string;
}
/**
 * MaxFilterExceedErr constructs an Err indicating the maximum amount of
 * filters allowed has been surpassed in the source string.
 *
 * @param max - The maximum number of filters allowed.
 * @param actual   - The number of filters encountered.
 */
export declare class MaxFilterExceededErr extends CompileErr {
    allowed: number;
    actual: number;
    constructor(allowed: number, actual: number);
    message: string;
}
/**
 * UnsupportedFieldErr constructs an Err indicating a filter is using an
 * unsupported field.
 */
export declare class UnsupportedFieldErr extends CompileErr {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    message: string;
}
/**
 * UnsupportedOperatorErr indicates an unsupported operator was used on a field.
 */
export declare class UnsupportedOperatorErr extends CompileErr {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    message: string;
}
/**
 * InvalidTypeErr indicates the value used with the filter is the incorrect type.
 */
export declare class InvalidTypeErr extends CompileErr {
    field: string;
    operator: string;
    value: Value;
    type: string | string[];
    constructor(field: string, operator: string, value: Value, type: string | string[]);
    message: string;
}
