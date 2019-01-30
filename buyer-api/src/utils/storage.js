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
 * @property {function(K):Promise<V>} fetch Retrives the value parsed from LevelDB
 * @property {function(K):Promise<V>} safeFetch As fetch but retrives null if missing
 * @property {function(K,V):Promise<void>} store Stores the value stringified on LevelDB
 * @property {function():Promise<K[]>} listKeys Lists all the keys stored on LevelDB
 * @property {function():Promise<V[]>} listValues Lists all the values stored on LevelDB
 * @property {function():Promise<({id:K}&V)[]>} list Lists all the objects stored on LevelDB
 * @template K
 * @template V
 */

/**
 * @function createLevelStore Creates a level store
 * @param {string} dir Path to the store, starting on {config.levelDirectory}
 * @returns {LevelStore} A store that uses LevelDB with the given path
 */
export const createLevelStore = (dir) => {
  const store = level(`${config.levelDirectory}/${dir}`, (err, db) => {
    if (err) { throw new Error(err); }
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
