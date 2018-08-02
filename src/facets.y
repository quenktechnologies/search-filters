
%lex

/* Definitions */
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
OctalEscapeSequence (?:[1-7][0-7]{0,2}|[0-7]{2,3})
HexEscapeSequence [x]{HexDigit}{2}
UnicodeEscapeSequence [u]{HexDigit}{4}
EscapeSequence {OctalEscapeSequence}|{HexEscapeSequence}|{UnicodeEscapeSequence}
DoubleStringCharacter ([^\"\\\n\r]+)
StringLiteral (\"{DoubleStringCharacter}*\")
DateLiteral [0-9]{4}[-]([0][0-9]|1[0-2])[-]([0-2][0-9]|3[01])
Identifier [a-zA-Z$_][a-zA-Z$\\._\-0-9]*

/* Flags */
%options flex
%x STRING_LITERAL
%%

/* Rules */
\s+                                                             /* skips whitespace */
'true'                                                          return 'TRUE';
'false'                                                         return 'FALSE';
{DateLiteral}                                                   return 'DATE_LITERAL';
'OR'|'or'                                                       return 'OR';
'AND'|'and'                                                     return 'AND';
{Identifier}                                                    return 'FIELD';
{NumberLiteral}                                                 return 'NUMBER_LITERAL';
'('                                                             return '(';
')'                                                             return ')';
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
'"'                       this.begin('STRING_LITERAL');         return 'QUOTE';
<STRING_LITERAL>[^"\n]+                                         return 'STRING_LITERAL';
<STRING_LITERAL>["]       this.popState();                      return 'QUOTE';
<*><<EOF>>                                                      return 'EOF';

/lex
%ebnf
%start conditions

%%

conditions
            : filters EOF
              {$$ = new yy.ast.Conditions($1, @$); return $$;     }

            | filter EOF
              {$$ = new yy.ast.Conditions($1, @$); return $$;     }

            | EOF
              {$$ = new yy.ast.Conditions(null, @$); return $$;   }
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
              {$$ = new yy.ast.Filter($1, 'default', $3, @$);}
            ;

operator
            : ('>'|'<'|'>='|'<='|'='|'!=')
              {$$ = $1; }
            ;

value
            : list 
              {$$ =$1;}
              
            | dict 
              {$$ =$1;}

            | date_literal
              {$$ = $1;}

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

date_literal
            : DATE_LITERAL
              {$$ = new yy.ast.DateLiteral($1, @$);   }
            ;

string_literal
            : QUOTE STRING_LITERAL QUOTE
              {$$ = new yy.ast.StringLiteral($2, @$); }

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
