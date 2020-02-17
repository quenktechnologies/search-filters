import { assert } from '@quenk/test/lib/assert';
import { Except } from '@quenk/noni/lib/control/error';
import { right } from '@quenk/noni/lib/data/either';
import { Value } from '@quenk/noni/lib/data/jsonx';

import { AvailablePolicies, EnabledPolicies } from '../lib/compile/policy';
import { TermFactory, Term } from '../lib/compile/term';
import { Context, Options, newContext, compile } from '../lib/compile';
import { UnsupportedFieldErr } from '../lib/compile/error';

interface QLTerm extends Term<string> { }

class EmptyTerm implements QLTerm {

    type = 'empty';

    compile(): Except<string> {

        return right('');

    }

}

class AndTerm implements QLTerm {

    type = 'and';

    constructor(public left: QLTerm, public right: QLTerm) { }

    compile(): Except<string> {

        let eLeft = this.left.compile();

        if (eLeft.isLeft()) return eLeft;

        let eRight = this.right.compile();

        if (eRight.isLeft()) return eRight;

        return right(`${eLeft.takeRight()} and ${eRight.takeRight()}`);

    }

}

class OrTerm implements QLTerm {

    type = 'or';

    constructor(public left: QLTerm, public right: QLTerm) { }

    compile(): Except<string> {

        let eLeft = this.left.compile();

        if (eLeft.isLeft()) return eLeft;

        let eRight = this.right.compile();

        if (eRight.isLeft()) return eRight;

        return right(`${eLeft.takeRight()} or ${eRight.takeRight()}`);

    }

}

class FilterTerm implements QLTerm {

    constructor(
        public field: string,
        public op: string,
        public value: string) { }

    type = 'filter';

    static create = (field: string, op: string, value: Value) =>
        new FilterTerm(field, op, cast(value));

    compile(): Except<string> {

        let { field, op, value } = this;
        return right(`${field} ${op} ${value}`);

    }

}

const cast = (v: Value) => (v instanceof Date) ? v.toISOString() :
    Array.isArray(v) ? v.map(cast).join(',') : String(v);

const available: AvailablePolicies<string> = {

    string: {

        type: 'string',

        operators: ['='],

        term: FilterTerm.create

    },
    number: {

        type: 'number',

        operators: ['=', '>', '<', '<=', '>=', '!='],

        term: FilterTerm.create

    },
    date: {

        type: 'date',

        operators: ['=', '>', '<', '<=', '>=', '!='],

        term: FilterTerm.create

    }

}

const enabled: EnabledPolicies<string> = {

    name: 'string',

    age: 'number',

    location: {

        type: 'string',

        operators: ['=', '>', '<', '<=', '>=', '!='],

        term: FilterTerm.create

    },

    last_login: 'date',

    ref_number: {

        type: ['string', 'number'],

        operators: ['='],

        term: FilterTerm.create

    },

    numbers: {

        type: 'list-number',

        operators: ['='],

        term: FilterTerm.create

    },
    booleans: {

        type: 'list-boolean',

        operators: ['='],

        term: FilterTerm.create

    },

    strings: {

        type: 'list-string',

        operators: ['='],

        term: FilterTerm.create

    },

    dates: {

        type: 'list-date',

        operators: ['='],

        term: FilterTerm.create

    },

    string_or_number_or_date: [

        'string',
        'number', {

            type: 'date',

            operators: ['=', '>', '<', '<=', '>=', '!='],

            term: FilterTerm.create

        }]

}

const terms: TermFactory<string> = {

    empty(): QLTerm {

        return new EmptyTerm();

    },

    and(l: QLTerm, r: QLTerm): QLTerm {

        return new AndTerm(l, r);

    },

    or(l: QLTerm, r: QLTerm): QLTerm {

        return new OrTerm(l, r);

    }

};

const qlc = (src: string, options: Partial<Options> = {}) =>
    compile(newContext(terms, available, options), enabled, src);

describe('compile', () => {

    describe('compile', () => {

        it('should compile a query string', () => {

            let eResult = qlc('name:foo,age:>=25|location:<="33.5"');

            assert(eResult.isRight()).true();

            assert(eResult.takeRight())
                .equal('name = foo and age >= 25 or location <= 33.5');

        })

        it('should fail on unknown fields (when enabled)', () => {

            let eResult = qlc('name:bar and created_at:<="33.5"');

            assert(eResult.isLeft()).true();

            assert(eResult.takeLeft()).instance.of(UnsupportedFieldErr);

        })

        it('should ignore on unknown fields (when enabled)', () => {

            let eResult = qlc('name:foo or created_at:<="33.5"',
                { ignoreUnknownFields: true });

            assert(eResult.isRight()).true();

            assert(eResult.takeRight()).equal('');

        })

        it('should reject incorrect types', () => {

            let eResult = qlc('name:=33.5');

            assert(eResult.isLeft()).true();

        })

        it('should reject invalid operators', () => {

            let eResult = qlc('name:>"33.5"');

            assert(eResult.isLeft()).true();

        })

        it('should support dates', () => {

            let eResult = qlc('last_login:>1989-04-03');

            assert(eResult.isRight()).true();

            assert(eResult.takeRight()).equal('last_login > 1989-04-03T00:00:00.000Z');

        })

        it('should support date time', () => {

            let eResult = qlc('last_login:>1989-04-03T00:00:00.001Z');

            assert(eResult.isRight()).true();

            assert(eResult.takeRight()).equal('last_login > 1989-04-03T00:00:00.001Z');

        })

        it('should support alternate value types', () => {

            assert(qlc('ref_number:1').isRight()).true();
            assert(qlc('ref_number:"1"').isRight()).true();
            assert(qlc('ref_number:["1"]').isRight()).false();
            assert(qlc('ref_number:true').isRight()).false();

        })

        it('should support list-number type', () => {

            let eResult = qlc('numbers:[1,2,3,4]');

            assert(eResult.isRight()).true();

            assert(eResult.takeRight()).equal('numbers = 1,2,3,4');

        })

        it('should check list-number type', () => {

            let eResult = qlc('numbers:[1,2,"3",4]');

            assert(eResult.isRight()).false();

        })

        it('should support list-boolean type', () => {

            let eResult = qlc('booleans:[true,false]');

            assert(eResult.isRight()).true();

            assert(eResult.takeRight()).equal('booleans = true,false');

        })

        it('should check list-boolean type', () => {

            let eResult = qlc('booleans:[true, "false"]');

            assert(eResult.isRight()).false();

        })

        it('should support list-string type', () => {

            let eResult = qlc('strings:["a","ab","abc"]');

            assert(eResult.isRight()).true();

            assert(eResult.takeRight()).equal('strings = a,ab,abc');

        })

        it('should check list-string type', () => {

            let eResult = qlc('strings:["false",true]');

            assert(eResult.isRight()).false();

        })

        it('should support list-date type', () => {

            let eResult = qlc('dates:[1956-03-07,1978-02-24,1979-05-24]');

            assert(eResult.isRight()).true();

            assert(eResult.takeRight())
                .equal('dates = 1956-03-07T00:00:00.000Z' +
                    ',1978-02-24T00:00:00.000Z' +
                    ',1979-05-24T00:00:00.000Z');

        })

        it('should check list-date type', () => {

            let eResult = qlc('dates:[1989-04-03, 1]');

            assert(eResult.isRight()).false();

        })

        it('should support multiple policies', () => {

            assert(qlc('string_or_number_or_date: "foo"').isRight()).true();
            assert(qlc('string_or_number_or_date: >22').isRight()).true();
            assert(qlc('string_or_number_or_date: 1989-04-03').isRight()).true();

            assert(qlc('string_or_number_or_date: >"1989-04-03"').isRight()).false();
            assert(qlc('string_or_number_or_date: ["1989-04-03"]').isRight()).false();
            assert(qlc('string_or_number_or_date: false').isRight()).false();

        });

    });

});
