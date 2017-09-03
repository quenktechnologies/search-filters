/// <reference path='Parser.d.ts' />
import * as Node from './Node';
import Parser = require('./Parser');

export { Node };

export interface AST {

    [key: string]: Node.Node

}

export const parse = (str: string, ast: AST = <any>Node): Node.Conditions => {

    Parser.parser.yy = { ast };
    return Parser.parser.parse(str);

}
