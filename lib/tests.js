"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * tests
 */
exports.tests = {
    'should parse a single filter': {
        input: 'type:c',
    },
    'should parse two filters': {
        input: 'type:c name:johan',
    },
    'should allow any character except \'"\' between double quotes': {
        input: 'type:"%><>?:L^#@!@#%^&p:%\'for long\'!@<=a:%22>=<>#\\$%^&{()\'\`f`\\"',
    },
    'should parse three filters': {
        input: 'type:c name:johan active:false',
    },
    'should parse with all basic operators': {
        input: 'age:>14 rank:<23 price:>=22.40 discount:<=5.40 name:"Product name"',
    },
    'should parse with the OR operator': {
        input: 'tag:old OR tag:new'
    },
    'should parse with the OR operator continued': {
        input: 'tag:old OR tag:new OR user:grandma OR filetype:jpeg'
    },
    'should parse date literals': {
        input: 'dob:2009-04-03'
    },
    'should parse dots': {
        input: 'user.username:"faro"'
    },
    'should not be thrown off by extra whitespace': {
        input: 'type: "P",   name: "Sargent",  date_of_birth:  "1990-07-12"'
    },
    'should allow grouping (single)': {
        input: '(type:"P")'
    },
    'should allow grouping (two with OR)': {
        input: '(type:"P" OR name:"Sargent")'
    },
    'should allow grouping (two with AND)': {
        input: '(type:"P" AND name:"Sargent")'
    },
    'should allow grouping (two with commas)': {
        input: '(type:"P" , name:"Sargent")'
    },
    'should allow grouping (complex)': {
        input: '(type:"P" , name:"Sargent") and (type:"P" or name:"Sa")'
    },
    'should allow use of pipes in place of or': {
        input: '(type:"P" \'|\' name:"Sargent")'
    }
};
//# sourceMappingURL=tests.js.map