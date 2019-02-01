import asyncRedis from 'async-redis';
import redis from 'redis';
import level from 'level';
import config from '../../config';

const { url, prefix } = config.redis;
export const createRedisStore = ns =>
  asyncRedis.decorate(redis.createClient(url, { prefix: `${prefix}:${ns}` }));

const listLevelStream = stream =>
  new Promise((resolve, reject) => {
    const result = [];
    stream
      .on('data', data => result.push(data))
      .on('error', reject)
      .on('end', () => resolve(result));
  });

export const createLevelStore = (dir) => {
  const store = level(`${config.levelDirectory}/${dir}`, (err, db) => {
    if (err) {
      throw new Error(err);
    }
    return db;
  });
  store.fetch = async id => JSON.parse(await store.get(id));
  store.safeFetch = async (id) => {
    try {
      return await store.fetch(id);
    } catch (_) {
      return null;
    }
  };
  store.store = (id, payload) => store.put(id, JSON.stringify(payload));
  store.list = () => listLevelStream(store.createReadStream())
    .then(({ key, value }) => ({ id: key, ...JSON.parse(value) }));
  store.listKeys = () => listLevelStream(store.createKeyStream());
  store.listValues = () => listLevelStream(store.createValueStream());
  return store;
};
