import { assert } from 'chai';
import { describe, it } from 'mocha';

import getLogger from '../src/libs/logs';
import { MohismLogger } from '../src/libs/logs/mohism-log';

describe('get-logger', () => {
  it('production', () => {
    process.env.NODE_ENV = 'production';
    assert(getLogger() instanceof MohismLogger);
  })
});