
# Search Filters

Provides a parser and related APIs for converting a string sequence
of filter conditions (query string) into usable search filters.

## Installation

```sh
npm install --save-dev @quenk/search-filters

```

## Usage

This module only provides an API for parsing a string into an Abstract Syntax
Tree with some additional helpers for compilation.

To actually generate valid query filters for a target, use a supported module:

Supported targets:

1. [search-filters-mongodb](https://github.com/quenktechnologies/search-filters-mongodb).

Alternatively, you can implement your own compiler.

## Syntax

### The Query String

A valid query string consists of a sequence of one or more "filters" seperated
by the following logical operators:

1. "and"       - indicates the filters are chained via a logical "AND".
2. ","         - same as above.
4. "or"        - indicates the filters are chained via a logical "OR".
5. "|"         - same as above.


Example:
```js
let qs1 = 'name:"jon"';
let qs2 = 'name:"jon" or name:"jon\'s" age:>=12';
let qs3 = '(name:"jon" or name:"jon\'s") and age:>=12';

```

Filters can be grouped together via parenthesis "(" ")" to ensure precedence
is kept during parsing.

### Filters

A filter consists of a field name part, colon, optional operator and a value
part:

```bnf
<field> <colon> <operator>? <value>
```
The field name is any valid ECMAScript identifier.
The operator is one of `>,<,>=<=,=,!=`. If no operator is specified then the
special operator `default` is assumed which means it is up to the compiler
to decide which operator to apply.

The standard right now is to use the first operator specificed in the policy.

The value part can either be a `string` surronded by double quotes, an 
identifier which is treated as a string, a valid ECMAScript `number` literal,
one of the boolean values `true` or `false`, an "array" of values or a 
"dictionary" (object literal) of key value pairs.

A compile target only needs to support those values that are valid for the
underlying query language.

## License

Apache 2.0 (SEE LICENSE) file. (c) 2020 Quenk Technologies Limited.
