import { describe, it } from 'mocha';

import { exec } from '../src';

describe('exec', () => {
  it('all', () => {
    try {
      exec('ls -l');
    } catch (e) {
      // 
    }
  })
});