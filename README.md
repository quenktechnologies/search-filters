
# Search Filters

Provides a parser and related APIs for converting a string sequence
of filter conditions (query string) into usable search filters.

## Installation

```sh
npm install --save-dev @quenk/facets-dsl

```

## Usage

This module only provides the APIs for parsing a string into an AST and some
helpers for compilation.

To actually generate a query from a filter string, use a module for a supported
target or implement one use them as a guide.

Supported platforms:

1. [search-filters-mongodb](https://github.com/quenktechnologies/search-filters-mongodb) 

## Syntax

### Query String

A valid query string consists of a sequence of one or more "filters" seperated
by the following operators:

1. "," (space) - indicates the filters are chained via a logical "AND".
2. ","         - Same as above.
4. "or"        - indicates the filters are chained via a logical "OR".
5. "|"         - Same as above.

In short, a sequence of more than one filter is either chained together via a
logical "AND" or "OR".

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

This is usually set in the policy.

The value part can either be a `string` surronded by double quotes, an 
identifier which is treated as a string, a valid ECMAScript `number` literal,
one of the boolean values `true` or `false`, an "array" of values or a 
"dictionary" (object literal) of key value pairs.

A compile target may not support all the value types.

## License

Apache 2.0 (SEE LICENSE) file. (c) 2020 Quenk Technologies Limited.
