/// <reference path='Parser.d.ts' />
import * as nodes from './Node';
import Parser = require('./Parser');

export { Node as Node } from './Node';

export interface AST {

    [key: string]: nodes.Node

}

export const parse = (str: string, ast: AST = <any>nodes): nodes.Conditions => {

    Parser.parser.yy = { ast };
    return Parser.parser.parse(str);

}
