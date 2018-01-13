
# facets-parser

>> Parser for a DSL for defining faceted search terms.

## Installation

```sh
npm install --save-dev @quenk/facets

```

## Usage

By itself, this module only provides functions and primitives for creating a compiler for the DSL.
(See [facets-mysql](https://github.com/quenktechnologies/facets-mysql) for an implementation example.)

### The Language

The parser recognizes filters in a string that look like:

```bnf
<field> <colon> <operator>? <value>
```

Example:
```js

var source = 'name:"jon" or name:"jon\'s" age:>=12';

```
Where operator is `<optional>` and if not specified defaults to 'default'. 
The `<field>` part roughly matches the javascript syntax for variable identifiers,
operators are currently one of `>,<,>=,<=,=,!=` and values are one of 
`string`, `number`, `boolean`, `list` (array) or a `dictionary` (object).

Strings are specified using double quotes `"`. Strings that are also valid Javascript
identifiers can be specified without double quotes.o

### Parsing

There is a curried function exported called `parse` that takes an object of key Node constructor mappings
followed by the source text that produces an abstract syntax tree. The partially applied `parse$` can 
be used instead for parsing with defaults.

`parse` returns an `Either` with the left hand side representing an error and the right the AST.

### Compiling

Once you have an AST, (see [src/ast](src/ast/index.ts) for nodes) it can be compiled using the
curried function `compile`. `compile` takes a `Context` followed by a record of `Policy` descriptions.

The Context provides needed functions for compile `and` and `or` expressions as well as other options.
`Policy` descriptions are used during compilation to determine what fields are excepted and how to treat them.

You can supply the whole policy in the record or use a string to indicate it should be retrieved from 
the Context's `policies` property. 

## Todo

Improve documentation.

## License

Apache 2.0 (SEE LICENSE) file. (c) Quenk Technologies Limited.
