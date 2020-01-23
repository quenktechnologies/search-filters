import { Value } from "@quenk/noni/lib/data/jsonx";
import { FilterInfo } from "./term";
/**
 * MaxFilterExceedErr constructs an Err indicating the maximum amount of
 * filters allowed has been surpassed in the source string.
 *
 * @param max - The maximum number of filters allowed.
 * @param actual   - The number of filters encountered.
 */
export declare class MaxFilterExceededErr {
    allowed: number;
    actual: number;
    constructor(allowed: number, actual: number);
    message: string;
}
/**
 * UnsupportedFieldErr constructs an Err indicating a filter is using an
 * unsupported field.
 */
export declare class UnsupportedFieldErr {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    message: string;
    /**
     * fromFilterInfo constructs an UnsupportedFiledErr from a FilterInfo.
     */
    static fromFilterInfo(info: FilterInfo): UnsupportedFieldErr;
}
/**
 * UnsupportedOperatorErr indicates an unsupported operator was used on a field.
 */
export declare class UnsupportedOperatorErr {
    field: string;
    operator: string;
    value: Value;
    constructor(field: string, operator: string, value: Value);
    message: string;
    /**
     * fromFilterInfo constructs an UnsupportedOperatorErr from a FilterInfo.
     */
    static fromFilterInfo({ field, operator, value }: FilterInfo): UnsupportedOperatorErr;
}
/**
 * InvalidTypeErr indicates the value used with the filter is the incorrect type.
 */
export declare class InvalidTypeErr {
    field: string;
    operator: string;
    value: Value;
    type: string;
    constructor(field: string, operator: string, value: Value, type: string);
    message: string;
    /**
     * fromFilterInfo constructs an InvalidTypeErr from a FilterInfo.
     */
    static fromFilterInfo({ field, operator, value }: FilterInfo, type: string): InvalidTypeErr;
}
