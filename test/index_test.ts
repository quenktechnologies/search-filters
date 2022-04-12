import { assert } from '@quenk/test/lib/assert';

import { sanitize } from '../lib';

describe('sanitize', () => {

    it('should remove unwanted characters', () => {

        let str = ' post: 12, status=active or id > 1 or id >= 1 | id < 1 or ' +
            ' id in [1,2,3] and (status = true)'

        let expected = ' post 12 statusactive  id  1  id  1  id < 1   id  123  status  true';


        assert(sanitize(str)).equal(expected);

    });

});
