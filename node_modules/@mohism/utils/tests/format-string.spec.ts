import { assert } from 'chai';
import { describe, it } from 'mocha';
import { toabcDef, toAbcDef } from '../src/libs/formatString';


describe('format-string', () => {
  it('should return AbcDef', () => {
    assert.equal(toAbcDef('abc def'), 'AbcDef')
  });

  it('should return abcDef', () => {
    assert.equal(toabcDef('abc def'), 'abcDef')
  })
})