import td from 'testdouble';
import asyncRedis from 'async-redis';
import redisMock from 'redis-mock';
import createLevel from 'level-test';

const level = createLevel();

export const mockStorage = () =>
  td.replace('../src/utils/storage', {
    // eslint-disable-next-line no-unused-vars
    createRedisStore: ns => asyncRedis.decorate(redisMock.createClient()),
    // eslint-disable-next-line no-unused-vars
    createLevelStore: ns => level('test'),
  });

export const restoreMocks = () => td.reset();
