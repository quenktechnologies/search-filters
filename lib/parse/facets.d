
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
Identifier [a-zA-Z$_][a-zA-Z$_0-9-.]*
Characters [a-zA-Z][a-zA-Z]*
OctalEscapeSequence (?:[1-7][0-7]{0,2}|[0-7]{2,3})
HexEscapeSequence [x]{HexDigit}{2}
UnicodeEscapeSequence [u]{HexDigit}{4}
EscapeSequence {OctalEscapeSequence}|{HexEscapeSequence}|{UnicodeEscapeSequence}
DoubleStringCharacter ([^"\n\r]|\\\")
StringLiteral (\"{DoubleStringCharacter}+\")|(\"\")
DateLiteral \d{4}-\d{2}-\d{2}
TimeHrs \d{2}
TimeHrsMin {TimeHrs}":"\d{2}
TimeHrsMinSec {TimeHrsMin}":"\d{2}
TimeHrsMinSecFrac {TimeHrsMinSec}[.]\d{3}
Time {TimeHrsMinSecFrac}|{TimeHrsMinSec}|{TimeHrsMin}|{TimeHrs}
TimeOffset ([+-]\d{2}":"\d{2})
DateTimeLiteral {DateLiteral}T{Time}(Z|{TimeOffset})?
Identifier [a-zA-Z$_][a-zA-Z$\\._\-0-9]*

/* Flags */
%options flex
%%

/* Rules */
\s+                                         /* skips whitespace */
'true'                                      return 'TRUE';
'false'                                     return 'FALSE';
{DateTimeLiteral}                           return 'DATE_TIME_LITERAL';
{DateLiteral}                               return 'DATE_LITERAL';
'OR'|'or'                                   return 'OR';
'AND'|'and'                                 return 'AND';
'!in'|'!IN'                                 return 'NIN';
'in'|'IN'                                   return 'IN';
{Characters}                                return 'CHARACTERS';
{Identifier}                                return 'IDENTIFIER';
{StringLiteral}                             return 'STRING_LITERAL';
{NumberLiteral}                             return 'NUMBER_LITERAL';
'('                                         return '(';
')'                                         return ')';
':'                                         return ':';
'['                                         return '[';
']'                                         return ']';
','                                         return ',';
'>='                                        return '>=';
'>'                                         return '>';
'<='                                        return '<=';
'<'                                         return '<';
'='                                         return '=';
'?'                                         return '?';
'|'                                         return '|';
<*><<EOF>>                                  return 'EOF';

/lex
%ebnf
%start query

%%

query
            : filters EOF
              {$$ =
               new yy.ast.Query(yy.just($1), yy.filterCount, @$);               
               return $$;    
              }

            | EOF
              {$$ = new yy.ast.Query(yy.nothing, yy.filterCount, @$); return $$; }
            ;

filters
            : filter
              {$$ = $1; }

            | binary_filter
              {$$ = $1; }

            | filter_group
              {$$ = $1; }

            | filter_groups
              {$$ = $1; }
            ;

filter_groups

            : filter_group OR filter 
              {$$ = new yy.ast.Or($1, $3, @$);     }

            | filter_group OR binary_filter 
              {$$ = new yy.ast.Or($1, $3, @$);     }

            | filter_group OR filter_group
              {$$ = new yy.ast.Or($1, $3, @$);     }

            | filter OR filter_group  
              {$$ = new yy.ast.Or($1, $3, @$);     }

            | binary_filter OR filter_group  
              {$$ = new yy.ast.Or($1, $3, @$);     }


            | filter_group AND filter 
              {$$ = new yy.ast.And($1, $3, @$);    }

            | filter_group AND binary_filter 
              {$$ = new yy.ast.And($1, $3, @$);    }

            | filter_group AND filter_group
              {$$ = new yy.ast.And($1, $3, @$);    }

            | filter AND filter_group  
              {$$ = new yy.ast.And($1, $3, @$);    }

            | binary_filter AND  filter_group  
              {$$ = new yy.ast.And($1, $3, @$);    }


            | filter_group '|' filter 
              {$$ = new yy.ast.Or($1, $3, @$);     }

            | filter_group '|' binary_filter 
              {$$ = new yy.ast.Or($1, $3, @$);     }

            | filter_group '|' filter_group
              {$$ = new yy.ast.Or($1, $3, @$);     }

            | filter '|'  filter_group  
              {$$ = new yy.ast.Or($1, $3, @$);     }

            | binary_filter '|'  filter_group  
              {$$ = new yy.ast.Or($1, $3, @$);     }


            | filter_group ',' filter 
              {$$ = new yy.ast.And($1, $3, @$);     }

            | filter_group ',' binary_filter 
              {$$ = new yy.ast.And($1, $3, @$);     }

            | filter_group ',' filter_group
              {$$ = new yy.ast.And($1, $3, @$);     }

            | filter ','  filter_group  
              {$$ = new yy.ast.And($1, $3, @$);     }

            | binary_filter ','  filter_group  
              {$$ = new yy.ast.And($1, $3, @$);     }


            | '(' filter_groups ')'
              {$$ = $2;                             }
            ;

filter_group

            : '(' filter ')'
               {$$ = $2;                            }

            | '(' binary_filter ')'
               {$$ = $2;                            }
            ;

binary_filter
         
            : filter OR filter 
              {$$ = new yy.ast.Or($1, $3, @$);    }

            | filter '|' filter 
              {$$ = new yy.ast.Or($1, $3, @$);    }

            | filter filter 
              {$$ = new yy.ast.And($1, $2, @$);    }

            | filter AND filter 
              {$$ = new yy.ast.And($1, $3, @$);   }

            | filter ',' filter 
              {$$ = new yy.ast.And($1, $3, @$);   }

            | binary_filter OR filter 
              {$$ = new yy.ast.Or($1, $3, @$);    }

            | binary_filter '|' filter 
              {$$ = new yy.ast.Or($1, $3, @$);    }

            | binary_filter filter 
              {$$ = new yy.ast.And($1, $2, @$);    }

            | binary_filter AND filter 
              {$$ = new yy.ast.And($1, $3, @$);   }

            | binary_filter ',' filter 
              {$$ = new yy.ast.And($1, $3, @$);   }
            ;

filter
            : identitifer ':' operator value 
              {$$ = new yy.ast.Filter($1, $3, $4, @$); yy.filterCount++; }

            | identitifer ':' value 
              {$$ = new yy.ast.Filter($1, 'default', $3, @$); yy.filterCount++; }
            ;

operator
            : ('>'|'<'|'>='|'<='|'='|'!='|IN|NIN)
              {$$ = $1; }
            ;

value
            : list 
              {$$ =$1;}
              
            | string_literal 
              {$$ =$1;}

            | number_literal
              {$$ =$1;}

            | boolean_literal
              {$$ =$1;}

            | date_literal
              {$$ = $1;}
            ;

list        
            : '[' ']'
              {$$ = new yy.ast.List([], @$); }

            | '[' list_value_list ']'
              {$$ = new yy.ast.List($2, @$); }
            ;

list_value_list  
            : list_value                      {$$ = [$1];         }
            | list_value_list ',' list_value  {$$ = $1.concat($3);}
            ;

list_value
            : string_literal 
              {$$ = $1;}

            | number_literal
              {$$ = $1;}

            | boolean_literal
              {$$ = $1;}

            | date_literal
              {$$ = $1;}
            ;

date_literal
            : DATE_LITERAL
              {$$ = new yy.ast.DateLiteral($1, @$);     }

            | DATE_TIME_LITERAL
              {$$ = new yy.ast.DateTimeLiteral($1, @$);     }
            ;

string_literal
            : STRING_LITERAL
              {$$ = new yy.ast.StringLiteral($1.slice(1, $1.length-1), @$); }

            | CHARACTERS 
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

identitifer 
            : (IDENTIFIER|CHARACTERS)
              {$$ = new yy.ast.Identifier($1, @$); }
            ;
