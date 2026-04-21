import { assert } from 'chai';
import { describe, it } from 'mocha';
import rightpad from '../src/libs/rightpad';

describe('right pad test', () => {
  it('normal', () => {
    assert.equal(rightpad('hello', 12).length, 12);
  });
  it('over flow', () => {
    assert.equal(rightpad('helloworld', 5).length, 5);
    assert.equal(rightpad('helloworld', 5), 'hello');
  });
});
