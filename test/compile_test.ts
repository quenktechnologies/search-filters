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
        new FilterTerm(field, op, (value instanceof Date) ?
            value.toISOString() : String(value));

    compile(): Except<string> {

        let { field, op, value } = this;
        return right(`${field} ${op} ${value}`);

    }

}

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
    last_login: 'date'

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

    });

});
