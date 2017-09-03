/// <reference path="Parser.d.ts" />
import * as Node from './Node';
export { Node };
export interface AST {
    [key: string]: Node.Node;
}
export declare const parse: (str: string, ast?: AST) => Node.Conditions;
