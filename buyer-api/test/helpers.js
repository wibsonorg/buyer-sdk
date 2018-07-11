import td from 'testdouble';
import asyncRedis from 'async-redis';
import redisMock from 'redis-mock';
import createLevel from 'level-test';

const level = createLevel();

export const mockStorage = () =>
  td.replace('../src/utils/storage', {
    createRedisStore: () => asyncRedis.decorate(redisMock.createClient()),
    createLevelStore: () => level('test'),
  });

export const restoreMocks = () => td.reset();
