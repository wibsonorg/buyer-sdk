import asyncRedis from 'async-redis';
import redis from 'redis';
import level from 'level';
import config from '../../config';

const { url, prefix } = config.redis;
export const createRedisStore = ns =>
  asyncRedis.decorate(redis.createClient(url, { prefix: `${prefix}:${ns}` }));

/**
 * @typedef LevelStore A store that uses LevelDB
 * @property {(id: K) => Promise<V>} fetch Retrives the value parsed from LevelDB
 * @property {(id: K) => Promise<V>} safeFetch As fetch but retrives null if missing
 * @property {(id: K, obj: V) => Promise<void>} store Stores the value stringified on LevelDB
 * @property {(id: K, obj: V) => Promise<void>} update Updates the value stringified on LevelDB
 * @property {(group: string) => Promise<({id:K}&V)[]>} list Lists all the objects stored on LevelDB
 * @property {(group: string) => Promise<K[]>} listKeys Lists all the keys stored on LevelDB
 * @property {(group: string) => Promise<V[]>} listValues Lists all the values stored on LevelDB
 * @template K
 * @template V
*/
/**
 * @function createLevelStore Creates a level store
 * @param {string} dir Path to the store, starting on {config.levelDirectory}
 * @returns {LevelStore<*,*>} A store that uses LevelDB with the given path
 */
export const createLevelStore = (dir) => {
  const store = level(`${config.levelDirectory}/${dir}`, (err, db) => {
    if (err) { throw new Error(err); }
    return db;
  });
  store.fetch = async id => JSON.parse(await store.get(id));
  store.safeFetch = async (id, defaultResponse = null) => {
    try {
      return await store.fetch(id);
    } catch (_) {
      return defaultResponse;
    }
  };
  store.store = (id, obj) => store.put(id, JSON.stringify(obj));
  store.update = async (id, obj) => {
    const value = await store.fetch(id);
    return store.store(id, { ...value, ...obj });
  };
  const createListFunction = mode => group => new Promise((res, rej) => {
    const result = [];
    store.createReadStream({
      keys: mode !== 'values',
      values: mode !== 'keys',
      ...(group ? { gte: group, lte: `${group}∞` } : {}),
    })
      .on('data', data => result.push(data))
      .on('error', rej)
      .on('end', () => res(result));
  }).then((list) => {
    switch (mode) {
      case 'keys': return list;
      case 'values': return list.map(value => JSON.parse(value));
      default: return list.map(({ key, value }) => ({ id: key, ...JSON.parse(value) }));
    }
  });
  store.list = createListFunction('all');
  store.listKeys = createListFunction('keys');
  store.listValues = createListFunction('values');
  return store;
};
