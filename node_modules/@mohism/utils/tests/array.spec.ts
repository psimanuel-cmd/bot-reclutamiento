
import { assert } from 'chai';
import { describe, it } from 'mocha';
import { countBy } from '../src'
const arr = [
  {
    name:'Tom',
    gender: 'male',
    age:16,
  },
  {
    name:'Tony',
    gender: 'male',
    age:18,
  },
  {
    name:'Mary',
    gender: 'female',
    age:16,
  }
];
describe('array test', () => {
  it('base', () => {
    assert.deepEqual(
      countBy(arr,'gender'),
      {
        male:2,
        female:1
      }
    );
  })
});