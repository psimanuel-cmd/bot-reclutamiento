import { describe, it } from 'mocha';
import MohismLogger, { LOG_DRIVER } from '../src/libs/logs/mohism-log';

const Logger = new MohismLogger({
  driver: LOG_DRIVER.console,
});

const L4j = new MohismLogger({
  driver: LOG_DRIVER.log4js,
  appID: 1000,
  logPath: '/tmp',
});

describe('mohism-logger-tests', () => {

  it('info', () => {
    Logger.info('warn');
  });
  it('warn', () => {
    Logger.warn('warn');
  });
  it('err', () => {
    Logger.err('err');
    Logger.error('err');
  });
  it('info object', () => {
    Logger.info({});
  });

  it('l4j info', () => {
    L4j.info('info');
  });

  it('l4j warn', () => {
    L4j.warn(['info']);
  });
});