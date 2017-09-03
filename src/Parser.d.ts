import { Conditions } from './Node';

export interface Parser {

    parse(src: string): Conditions;
    yy: any;

}

export declare function parse(src: string): Conditions;

export declare let parser: Parser;
