import * as must from 'must';
import * as fs from 'fs';
import { parse } from '../src';

var input = null;
var tests = null;

function json(tree: any): string {
    return JSON.stringify(tree);
}

function compare(tree: any, that: any): void {

    must(tree).eql(that);

}

function makeTest(test, index) {

    var file = index.replace(/\s/g, '-');

    if (process.env.GENERATE) {
        fs.writeFileSync(`./test/expectations/${file}.json`, json(parse(test.input)));
        return;
    }

    if (!test.skip) {

        compare(json(parse(test.input)), fs.readFileSync(`./test/expectations/${file}.json`, {
            encoding: 'utf8'
        }));

    }

}

tests = {

    'should parse a single filter': {
        input: 'type:c',
    },

    'should parse two filters': {

        input: 'type:c name:johan',

    },

    'should parse three filters': {

        input: 'type:c name:johan active:false',

    },

    'should parse with all basic operators': {

        input: 'age:>14 rank:<23 price:>=22.40 discount:<=5.40 name:?"Product name"',

    },

    'should parse with the OR operator': {

        input: 'tag:old OR tag:new'

    },

    'should parse with the OR operator continued': {

        input: 'tag:old OR tag:new OR user:?grandma OR filetype:jpeg'

    },

    'should parse the $in function': {

        input: 'tag:[24, 88.9,"mumch", 23.5, "Cake mix"]'

    }

};

describe('Parser', function() {

    beforeEach(function() {

        input = null;

    });

    describe('parse()', function() {

        Object.keys(tests).forEach(k => {

            it(k, function() {

                if (Array.isArray(tests[k])) {

                    tests[k].forEach(makeTest);

                } else {

                    makeTest(tests[k], k);

                }

            });
        });

    });

});
