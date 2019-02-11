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

/**
 * @typedef LevelStore A store that uses LevelDB
 * @property {(id: K) => Promise<V>} fetch Retrives the value parsed from LevelDB
 * @property {(id: K) => Promise<V>} safeFetch As fetch but retrives null if missing
 * @property {(id: K, obj: V) => Promise<void>} store Stores the value stringified on LevelDB
 * @property {() => Promise<K[]>} listKeys Lists all the keys stored on LevelDB
 * @property {() => Promise<V[]>} listValues Lists all the values stored on LevelDB
 * @property {() => Promise<({id:K}&V)[]>} list Lists all the objects stored on LevelDB
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
