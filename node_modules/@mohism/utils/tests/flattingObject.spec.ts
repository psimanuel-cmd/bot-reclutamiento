import { describe, it } from 'mocha';
import { assert } from 'chai';

import { flatting, reFlatting } from '../src/libs/flattingObject';

describe('flattingObject', () => {

  it('reflatting', () => {
    assert.deepEqual(reFlatting({
      'a.b.c': 1,
      'a.b.e': 'abe',
      'a.d': [1, 2, 3],
    }), {
      a: {
        b: {
          c: 1,
          e: 'abe',
        },
        d: [1, 2, 3]
      }
    })
  })

  it('flatting', () => {
    assert.deepEqual(flatting({
      a: {
        b: {
          c: 1,
          e: 'abe',
        },
        d: [1, 2, 3]
      }
    }), {
      'a.b.c': 1,
      'a.b.e': 'abe',
      'a.d': [1, 2, 3],
    })
  })
})