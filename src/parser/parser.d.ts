import { Query } from './ast';

export interface Parser {

    parse(src: string): Query;
    yy: any;

}

export declare function parse(src: string): Query;

export declare let parser: Parser;
