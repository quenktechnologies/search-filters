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
        input: '(type:"P" | name:"Sargent")'
    },
    'should parse dates': {
        input: 'created_on:1989-07-23'
    },
    'should parse date time (Local)': {
        input: 'created_on:1989-07-23T23:00:00'
    },
    'should parse date time (UTC)': {
        input: 'created_on:1989-07-23T23:00:00Z'
    },
    'should parse date time (with offset)': {
        input: 'created_on:1989-07-23T23:00:00+09:00'
    },
    'should parse date time (hours only local)': {
        input: 'created_on:1989-07-23T23'
    },
    'should parse date time (hours only UTC)': {
        input: 'created_on:1989-07-23T23Z'
    },
    'should parse date time (hours only with offset)': {
        input: 'created_on:1989-07-23T23+09:00'
    },
    'should parse date time (minutes local)': {
        input: 'created_on:1989-07-23T23:00'
    },
    'should parse date time (minutes UTC)': {
        input: 'created_on:1989-07-23T23:00Z'
    },
    'should parse date time (minutes with offset)': {
        input: 'created_on:1989-07-23T23:00-04:00'
    },
    'should parse date time (seconds local)': {
        input: 'created_on:1989-07-23T23:00:01'
    },
    'should parse date time (seconds UTC)': {
        input: 'created_on:1989-07-23T23:00:24Z'
    },
    'should parse date time (seconds with offset)': {
        input: 'created_on:1989-07-23T23:00-04:00'
    },
    'should parse date time (seconds with fraction local)': {
        input: 'created_on:1989-07-23T23:00:01.555'
    },
    'should parse date time (seconds with fraction UTC)': {
        input: 'created_on:1989-07-23T23:00:24.555Z'
    },
    'should parse date time (seconds with fraction and offset)': {
        input: 'created_on:1989-07-23T23:00:24.555-04:00'
    },
    'should parse (<filter>) <and> (<filter>,<filter)': {
        input: '(type:"P") and ' +
            '(name:"Rakim",date_of_birth:1968-01-28T00:00:00.000Z,' +
            'trini_national_id:"1968012875")'
    },
    'should parse ((<filter>) <and> (<filter>,<filter))': {
        input: '((type:"P") and ' +
            '(name:"Rakim",date_of_birth:1968-01-28T00:00:00.000Z,' +
            'trini_national_id:"1968012875"))'
    }
};
//# sourceMappingURL=tests.js.map