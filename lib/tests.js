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
    'should not allow double quotes between string literals': {
        input: 'type:"type%:"dom%""',
        skip: true //@todo to enable later
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
    'should parse the $in function': {
        input: 'tag:[24, 88.9,"mumch", 23.5, "Cake mix"]'
    },
    'should parse date literals': {
        input: 'dob:2009-04-03'
    },
    'should parse dotts': {
        input: 'user.username:"faro"'
    }
};
//# sourceMappingURL=tests.js.map