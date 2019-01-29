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
  store.store = (id, payload) => store.put(id, JSON.stringify(payload));
  store.listKeys = () => listLevelStream(store.createKeyStream());
  store.listValues = async () => {
    const list = await listLevelStream(store.createValueStream());
    return list.map(value => JSON.parse(value));
  };
  store.list = async () => {
    const list = await listLevelStream(store.createReadStream());
    return list.map(({ key, value }) => ({ id: key, ...JSON.parse(value) }));
  };
  return store;
};
