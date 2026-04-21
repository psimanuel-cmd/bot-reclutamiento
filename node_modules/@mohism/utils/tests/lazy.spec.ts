import { describe, it } from 'mocha';
import { assert } from 'chai';
import Maker from '../src/libs/lazy'

class A { };
class B { };

describe('lazy', () => {
  it('all', () => {
    (async () => {
      const makeA = Maker(async () => {
        return new A();
      });
      const makeB = Maker(async () => {
        return new B();
      });
      const a1 = await makeA()
      const a2 = await makeA();
      assert(a1===a2);

      const b1 = await makeB();
      const b2 = await makeB();
      assert(b1 === b2);

      assert(a1 !== b1);
    })().then(() => {

    }).catch(e => {

    })
  })
});