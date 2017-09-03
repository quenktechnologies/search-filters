
%lex

/* Definitions */
DecimalDigit [0-9]
DecimalDigits [0-9]+
NonZeroDigit [1-9]
OctalDigit [0-7]
HexDigit [0-9a-fA-F]
ExponentIndicator [eE]
SignedInteger [+-]?[0-9]+
DecimalIntegerLiteral [-]?([0]|({NonZeroDigit}{DecimalDigits}*))
ExponentPart {ExponentIndicator}{SignedInteger}
OctalIntegerLiteral [0]{OctalDigit}+
HexIntegerLiteral [0][xX]{HexDigit}+
DecimalLiteral ([-]?{DecimalIntegerLiteral}\.{DecimalDigits}*{ExponentPart}?)|(\.{DecimalDigits}{ExponentPart}?)|({DecimalIntegerLiteral}{ExponentPart}?)
NumberLiteral {DecimalLiteral}|{HexIntegerLiteral}|{OctalIntegerLiteral}
Identifier [a-zA-Z$_][a-zA-Z$_0-9-]*
DotIdentifier [a-zA-Z$_][a-zA-Z$_0-9.-]*
LineContinuation \\(\r\n|\r|\n)
OctalEscapeSequence (?:[1-7][0-7]{0,2}|[0-7]{2,3})
HexEscapeSequence [x]{HexDigit}{2}
UnicodeEscapeSequence [u]{HexDigit}{4}
SingleEscapeCharacter [\'\"\\bfnrtv]
NonEscapeCharacter [^\'\"\\bfnrtv0-9xu]
CharacterEscapeSequence {SingleEscapeCharacter}|{NonEscapeCharacter}
EscapeSequence {CharacterEscapeSequence}|{OctalEscapeSequence}|{HexEscapeSequence}|{UnicodeEscapeSequence}
DoubleStringCharacter ([^\"\\\n\r]+)|(\\{EscapeSequence})|{LineContinuation}
SingleStringCharacter ([^\'\\\n\r]+)|(\\{EscapeSequence})|{LineContinuation}
TemplateStringCharacter ([^\`\\\n\r]+)|(\\{EscapeSequence})|{LineContinuation}
StringLiteral (\"{DoubleStringCharacter}*\")|(\'{SingleStringCharacter}*\')|(\`{TemplateStringCharacter}*\`)

/* Flags */
%options flex
%%

/* Rules */
\s+                                                             /* skips whitespace */
'true'                                                          return 'TRUE';
'false'                                                         return 'FALSE';
{NumberLiteral}                                                 return 'NUMBER_LITERAL';
{StringLiteral}                                                 return 'STRING_LITERAL';
'OR'|'or'                                                       return 'OR';
'AND'|'and'                                                     return 'AND';
[^\[\]?<>:\s,"]+                                                return 'FIELD';
':'                                                             return ':';
'['                                                             return '[';
']'                                                             return ']';
','                                                             return ',';
'>='                                                            return '>=';
'>'                                                             return '>';
'<='                                                            return '<=';
'<'                                                             return '<';
'='                                                             return '=';
'?'                                                             return '?';
'%'                                                             return '%';
<*><<EOF>>                                                      return 'EOF';

/lex
%ebnf
%start conditions

%%

conditions
            : filters EOF
              {$$ = new yy.ast.Conditions($1, @$); return $$;     }

            | filter EOF
              {$$ = new yy.ast.Conditions([$1], @$); return $$;   }

            | EOF
              {$$ = new yy.ast.Conditions([], @$); return $$;     }
            ;

filters
            : filter filter
              {$$ = new yy.ast.And($1, $2, @$);  }

            | filters filter
              {$$ = new yy.ast.And($1, $2, @$);  }

            | filter AND filter
              {$$ = new yy.ast.And($1, $3, @$);  }

            | filter OR filter
              {$$ = new yy.ast.Or($1, $3, @$);   }

            | filters OR filter 
              {$$ = new yy.ast.Or($1, $3, @$);   }
            ;

filter
            : FIELD ':' operator value 
              {$$ = new yy.ast.Filter($1, $3, $4, @$);}

            | FIELD ':' value 
              {$$ = new yy.ast.Filter($1, '=', $3, @$);}
            ;

operator
            : ('>'|'<'|'>='|'<='|'='|'?'|'%')
              {$$ = $1; }
            ;

value
            : list 
              {$$ =$1;}
              
            | dict 
              {$$ =$1;}

            | string_literal 
              {$$ =$1;}

            | number_literal
              {$$ =$1;}

            | boolean_literal
              {$$ =$1;}
            ;

list        
            : '[' ']'
              {$$ = new yy.ast.List([], @$); }

            | '[' value_list ']'
              {$$ = new yy.ast.List($2, @$); }
            ;

value_list  
            : value                 {$$ = [$1];         }
            | value_list ',' value  {$$ = $1.concat($3);}
            ;

string_literal
            : STRING_LITERAL 
              {$$ = new yy.ast.StringLiteral($1.slice(1, -1), @$); }

            | FIELD
              {$$ = new yy.ast.StringLiteral($1, @$); }
            ;

boolean_literal
            : TRUE
              {$$ = new yy.ast.BooleanLiteral(true, @$);}

            | FALSE
              {$$ = new yy.ast.BooleanLiteral(false, @$);}
            ;

number_literal
            : NUMBER_LITERAL
              {$$ = new yy.ast.NumberLiteral(parseFloat($1), @$); }
            ;
