import { assert } from '@quenk/test/lib/assert';
import { Except } from '@quenk/noni/lib/control/error';
import { right } from '@quenk/noni/lib/data/either';

import { AvailablePolicies, EnabledPolicies } from '../lib/compile/policy';
import { FilterInfo, TermConstructorFactory, Term } from '../lib/compile/term';
import { Context, Options, newContext, compile } from '../lib/compile';
import { UnsupportedFieldErr } from '../lib/compile/error';

interface QLTerm extends Term<string> { }

class EmptyTerm implements QLTerm {

    static create = (): QLTerm => new EmptyTerm();

    compile(): Except<string> {

        return right('');

    }

}

class AndTerm implements QLTerm {

    constructor(public left: QLTerm, public right: QLTerm) { }

    static create = (_: Context<string>, l: QLTerm, r: QLTerm): QLTerm =>
        new AndTerm(l, r);

    compile(): Except<string> {

        let eLeft = this.left.compile();

        if (eLeft.isLeft()) return eLeft;

        let eRight = this.right.compile();

        if (eRight.isLeft()) return eRight;

        return right(`${eLeft.takeRight()} and ${eRight.takeRight()}`);

    }

}

class OrTerm implements QLTerm {

    constructor(public left: QLTerm, public right: QLTerm) { }

    static create = (_: Context<string>, l: QLTerm, r: QLTerm): QLTerm =>
        new OrTerm(l, r);

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

    static create = (_: Context<string>, info: FilterInfo) =>
        new FilterTerm(info.field, info.operator, String(info.value));

    compile(): Except<string> {

        let { field, op, value } = this;
        return right(`${field} ${op} ${value}`);

    }

}

class DateFilterTerm implements FilterTerm {

    static create = (_: Context<string>, info: FilterInfo) =>
        new DateFilterTerm(info.field, info.operator, String(info.value));

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

    }

}

const terms: TermConstructorFactory<string> = {

    empty: EmptyTerm.create,

    and: AndTerm.create,

    or: OrTerm.create

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

    });

});
