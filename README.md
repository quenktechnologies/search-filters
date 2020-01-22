
# Search Filters

## Table of Contents

- [Installation](#install)
- [Usage](#usage)
    - [Syntax](#syntax)
        - [The Source String](#the-source-string)
        - [Filters](#filters)
    - [Compilation](#compilation)
        - [Policies](#policies)
    - [API](#api)
    - [License](#license)
    
Parse and compile a string into usable search filters.

This library provides a parser and compiler API for converting a string sequence
of filter conditions into usable search filters. Use it to build faceted search 
interfaces in web applications or to provide advanced users with a search DSL.

## Installation

```sh
npm install --save-dev @quenk/search-filters

```

## Usage

This module by itself only provides a parser in `lib/parse` and supporting
APIs for creating a compiler in `lib/compile`. To actually generate valid query filters for
your target platform, use a supported module or implement your own compiler using  `lib/compile`.

Supported targets:

1. [search-filters-mongodb](https://github.com/quenktechnologies/search-filters-mongodb).

## Syntax

### The Source String

A valid source string consists of a sequence of one or more "filters" seperated
by the following logical operators:

1. "and", ","  - indicates the filters are chained via a logical "AND".
2. "or", "|"   - indicates the filters are chained via a logical "OR".

Example:
```js
let qs1 = 'name:"jon"';
let qs2 = 'name:"jon" or name:"jon\'s" age:>=12';
let qs3 = '(name:"jon" or name:"jon\'s") and age:>=12';

```

A source string is always parsed and compiled to one filter. That one
filter may be optionally composed of other filters via the use of logical AND or OR.

Filters can be grouped together via parenthesis "(" ")" to ensure precedence
is kept during parsing as shown above.

### Filters

A filter consists of a field name part, colon, optional operator and a value
part:

```bnf
<field> <colon> <operator>? <value>
```
Examples: `status:=1` or `status:1`.

The field name is any valid ECMAScript identifier or sequence of valid identifiers seperated 
via the ".", that is, a property path.

The colon is used to indicate the end of the field name and is followed by the operator or value if
none specified. If the operator part is ommited, the default operator is assumed. The default operator is determined by the policies set for the field.

The following operators are recognised by the parser:

1. ">"     Greater than.
2. "<"     Less than.
3. ">="    Greater than or equal to.
4. "<="    Less than or equal to.
5. "="     Equal to.
6. "!="    Not equal to.

The validity and actual implementation of these operators, and their accepted value types, depends on the policies set for the fields. Compilation fails if the wrong operator or type is used on a field.

The value part can either be one of the following values:

1. String  - A sequence of one or more unicode characters surronded by double quotes.
            Example: "my string"

2. Number  - Any number that can be represented in the IEEE 754 double format.

3. Boolean - The literal value true or the literal value false. 

4. List    - A comma seperated sequence of the above values surronded in "[" "]"

A compiler impelmentation only needs to support those values that are valid for the
underlying query language.

## Compilation

In `lib/compile` of this module a function `compile` is exported that
does most of the compilation work. Compilers need only pass an instance of `Context` with the required `Term` instances, `EnabledPolicies` the source string and valid filters for the target will be produced.

The `EnabledPolcies` instance is what determines what fields can be included in the
source string. The `EnabledPolicies` type supports either a literal `Policy` definition or a string pointing to one in the `policies` key of the passed Context.

Policy pointers that cannot be resolved will result in a failed compilation.

### Policies
A Policy has the following main fields:

1. type        -       Indicates the allowed type for the field.
                       One of (string,number or boolean).
2. operators   -       A list of supported operators for the field.
3. term        -       A function that will produce a `Term` instance of the filter.

## API

API documentation is generated and made available [here](https://quenktechnologies.github.io/search-filters).


## License

Apache 2.0 (SEE LICENSE) file. (c) 2020 Quenk Technologies Limited.
