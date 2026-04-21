import { assert } from 'chai';
import { describe, it } from 'mocha';

import getLogger from '../src/libs/logs';
import { ConsoleLogger } from '../src/libs/logs/console-log';

describe('get-logger', () => {
  it('dev', () => {
    assert(getLogger() instanceof ConsoleLogger);
  });
});