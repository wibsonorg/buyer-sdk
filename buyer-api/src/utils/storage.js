import asyncRedis from 'async-redis';
import redis from 'redis';
import level from 'level';
import config from '../../config';
import logger from './logger';
import { lock } from './lock';

const { url, prefix } = config.redis;
export const createRedisStore = ns =>
  asyncRedis.decorate(redis.createClient(url, { prefix: `${prefix}:${ns}` }));

/**
 * @typedef LevelStore A store that uses LevelDB
 * @property {(id: K) => Promise<V>} fetch Retrieves the value parsed from LevelDB
 * @property {(id: K) => Promise<V>} safeFetch As fetch but retrives null if missing
 * @property {(id: K, obj: V) => Promise<V>} store Stores the value stringified on LevelDB
 * @property {(id: K) => Promise<V>} delete Removes data from the store.
 * @property {(list: [K, V][]) => Promise<{Object<string, V>}>} storeList
 *    Stores a list of [key, value]
 * @property {(list: K[]) => Promise} deleteList Deletes a list of keys
 * @property {(id: K, obj: V) => Promise<boolean>} storeNonExistant
 *    Stores the value stringified on LevelDB, only if it doesnt exists returns true if stored
 * @property {(id: K, obj: V) => Promise<V>} update Updates the value stringified on LevelDB
 * @property {(id: K, value: V, defaultOldValue: V) => Promise<V>} storeGreatest
 *    Stores the greatest value
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
  store.fetch = async (id) => {
    try {
      const value = JSON.parse(await store.get(id));
      logger.debug(`STORAGE[${dir}].fetch(${id})`);
      return !Array.isArray(value) && typeof value === 'object'
        ? { id, ...value } : value;
    } catch (e) {
      throw new Error(`${dir} :: ${e.message}`);
    }
  };
  store.safeFetch = async (id, defaultValue) => {
    try {
      return await store.fetch(id);
    } catch (_) {
      return defaultValue;
    }
  };
  store.store = async (id, obj) => {
    try {
      const value = JSON.stringify(obj);
      logger.debug(`STORAGE[${dir}].store(${id}, ${value})`);
      await store.put(id, value);
      return obj;
    } catch (e) {
      logger.error(`${dir} :: Can't store value ${JSON.stringify(obj)} for key ${id}`);
      throw e;
    }
  };
  store.storeNonExistent = (id, mutations) =>
    lock([[store, id]], async () => {
      if (await store.safeFetch(id)) return false;
      const newValue = typeof mutations === 'function' ? await mutations() : mutations;
      await store.store(id, newValue);
      return true;
    });
  store.update = (id, mutations, defaultValue) =>
    lock([[store, id]], async () => {
      const oldValue = await store.safeFetch(id, defaultValue);
      const newValue = typeof mutations === 'function' ? await mutations(oldValue) : mutations;
      let updatedValue = newValue;
      if (Array.isArray(newValue)) {
        updatedValue = [...oldValue, ...newValue];
      } else if (typeof newValue === 'object' || newValue === undefined) {
        updatedValue = { ...oldValue, ...newValue };
      }
      return store.store(id, updatedValue);
    });
  store.storeGreatest = (id, newValue, defaultOldValue = 0) =>
    store.update(id, oldValue => Math.max(oldValue, newValue), defaultOldValue);
  store.storeList = async (list) => {
    logger.debug(`STORAGE[${dir}].storeList(${JSON.stringify(list)})`);
    await list.reduce((batch, [k, v]) => batch.put(k, JSON.stringify(v)), store.batch()).write();
    return list.reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});
  };
  store.deleteList = async (list) => {
    logger.debug(`STORAGE[${dir}].deleteList(${JSON.stringify(list)})`);
    await list.reduce((batch, k) => batch.del(k), store.batch()).write();
  };
  store.delete = async (id) => {
    try {
      logger.debug(`STORAGE[${dir}].delete(${id})`);
      await store.del(id);
      return true;
    } catch (e) {
      logger.error(`${dir} :: Can't delete value for key ${id}`);
      throw e;
    }
  };
  const createListFunction = mode => (group = {}) =>
    new Promise((res, rej) => {
      const result = [];
      store
        .createReadStream({
          keys: mode !== 'values',
          values: mode !== 'keys',
          ...(typeof group === 'object' ? group : { gte: group, lte: `${group}∞` }),
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
