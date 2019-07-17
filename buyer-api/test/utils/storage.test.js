import test from 'ava';
import {
  config,
  redis, fakeRedis,
  asyncRedis, fakeDecoratedRedis,
  level, fakeLevel,
} from './storage.mock';
import { createRedisStore, createLevelStore } from '../../src/utils/storage';

const it = test.serial;

it('uses the correct redis url', (assert) => {
  createRedisStore('someNamespace');
  assert.is(redis.createClient.lastCall.args[0], config.redis.url);
});

it('uses the correct redis prefix (config.prefix:namespace)', (assert) => {
  createRedisStore('someNamespace');
  assert.is(redis.createClient.lastCall.args[1].prefix, `${config.redis.prefix}:someNamespace`);
});

it('decorates redis client with async-redis', (assert) => {
  const store = createRedisStore('someNamespace');
  assert.is(asyncRedis.decorate.lastCall.args[0], fakeRedis);
  assert.is(store, fakeDecoratedRedis);
});

it('uses the correct directory on level', (assert) => {
  const store = createLevelStore('someNamespace');
  assert.is(level.lastCall.args[0], `${config.levelDirectory}/someNamespace`);
  assert.is(store, fakeLevel);
});

it('parses on fetch', async (assert) => {
  const store = createLevelStore('someNamespace');
  const value = await store.fetch('{"a":333}');
  assert.deepEqual(value, { id: '{"a":333}', a: 333 });
});

it('stringifies on store', async (assert) => {
  const store = createLevelStore('someNamespace');
  await store.store(666, { a: 333 });
  assert.deepEqual(store.put.lastCall.args, [666, '{"a":333}']);
});

it('calls the read stream on list', async (assert) => {
  const store = createLevelStore('someNamespace');
  const list = await store.list();
  assert.true(store.createReadStream.calledOnce);
  assert.snapshot(list, { id: 'store.list().returns' });
});
