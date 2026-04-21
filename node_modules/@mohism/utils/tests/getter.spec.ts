import { assert } from 'chai';
import { describe, it } from 'mocha';

import Getter from '../src/libs/getter';
import { Dict } from '../src/libs/type';

describe('getter', () => {
  it('all', () => {
    const data: Dict<number> = {
      tom: 100,
      jerry: 90,
    };
    const getter = new Getter(data);
    assert(getter.get('tom') === 100);
    assert(getter.get('jerry') === 90);

    assert(getter.get('other') === undefined);
  })
})