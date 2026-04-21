import { describe, it } from 'mocha';

import Logger from '../src/libs/logs/console-log';

describe('logger tests', () => {
  it('info', () => {
    Logger.info('info');
  });
  it('info2', () => {
    process.env.LOG_LEVEL = 'ultra';
    Logger.info('info');
    process.env.LOG_LEVEL = 'debug';
  });
  it('warn', () => {
    Logger.warn('warn');
  });
  it('warn2', () => {
    process.env.LOG_LEVEL = 'ultra';
    Logger.warn('warn');
    process.env.LOG_LEVEL = 'debug';
  });
  it('err', () => {
    Logger.err('err');
  });
  it('err2', () => {
    process.env.LOG_LEVEL = 'ultra';
    Logger.err('err');
    process.env.LOG_LEVEL = 'debug';
  });
  it('info object', () => {
    Logger.info({});
  });
});