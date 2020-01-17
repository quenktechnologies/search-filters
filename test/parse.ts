import * as must from 'must/register';
import * as fs from 'fs';

import { parse } from '../lib/parse';
import { tests } from '../lib/tests';

function json(tree: any): string {
    return JSON.stringify(tree);
}

function compare(tree: any, that: any): void {

    must(tree).eql(that);

}

function _throw(e: Error) {

    throw e;

}

function makeTest(test, index) {

    var file = index.replace(/\s/g, '-');

    if (!test.skip) {

        if (process.env.GENERATE) {

            parse(test.input)
                .map(json)
                .map(out => fs.writeFileSync(`./test/expectations/${file}.json`, out))
                .orRight(_throw)
            return;
        }

        parse(test.input)
            .map(json)
            .map(out => compare(out, fs.readFileSync(`./test/expectations/${file}.json`, { encoding: 'utf8' })))
            .orRight(_throw)

    }

}

describe('Parser', function() {

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
