import { Value } from "@quenk/noni/lib/data/jsonx";

import { FilterInfo } from "./term";

/**
 * MaxFilterExceedErr constructs an Err indicating the maximum amount of
 * filters allowed has been surpassed in the source string.
 *
 * @param max - The maximum number of filters allowed.
 * @param actual   - The number of filters encountered.
 */
export class MaxFilterExceededErr {

    constructor(public allowed: number, public actual: number) { }

    message = `Max ${this.allowed} filters are allowed, got ${this.actual}!`;

}

/**
 * UnsupportedFieldErr constructs an Err indicating a filter is using an 
 * unsupported field.
 */
export class UnsupportedFieldErr {

    constructor(
        public field: string,
        public operator: string,
        public value: Value) { }

    message = `Unsupported field "${this.field}" encountered!`;

    /**
     * fromFilterInfo constructs an UnsupportedFiledErr from a FilterInfo.
     */
    static fromFilterInfo(info: FilterInfo): UnsupportedFieldErr {

        return new UnsupportedFieldErr(info.field, info.operator, info.value);

    }

}

/**
 * UnsupportedOperatorErr indicates an unsupported operator was used on a field.
 */
export class UnsupportedOperatorErr {

    constructor(
        public field: string,
        public operator: string,
        public value: Value) { }

    message = `Invalid operator '${this.operator}' ` +
        `used with field '${this.field}'!`

    /**
     * fromFilterInfo constructs an UnsupportedOperatorErr from a FilterInfo.
     */
    static fromFilterInfo({ field, operator, value }: FilterInfo) {

        return new UnsupportedOperatorErr(field, operator, value);

    }

}

/**
 * InvalidTypeErr indicates the value used with the filter is the incorrect type.
 */
export class InvalidTypeErr {

    constructor(
        public field: string,
        public operator: string,
        public value: Value,
        public type: string) { }

    message = `Invalid type '${typeof this.value}' for field '${this.field}',` +
        ` expected type of '${this.type}'!`

    /**
     * fromFilterInfo constructs an InvalidTypeErr from a FilterInfo.
     */
    static fromFilterInfo({ field, operator, value }: FilterInfo, type: string) {

        return new InvalidTypeErr(field, operator, value, type);

    }

}
