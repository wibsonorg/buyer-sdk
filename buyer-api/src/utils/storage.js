import asyncRedis from 'async-redis';
import redis from 'redis';
import level from 'level';
import config from '../../config';

const { url: redisUrl, prefix } = config.redis;

const redisPrefix = ns => `${prefix}:${ns}`;

export const createRedisStore = ns =>
  asyncRedis.decorate(redis.createClient(redisUrl, { prefix: redisPrefix(ns) }));

export const createLevelStore = dir =>
  level(`${config.levelDirectory}/${dir}`, (err, db) => {
    if (err) {
      throw new Error(err);
    }
    return db;
  });

const listLevelStream = stream =>
  new Promise((resolve, reject) => {
    const result = [];
    stream
      .on('data', data => result.push(data))
      .on('error', err => reject(err))
      .on('end', () => resolve(result));
  });

export const listLevelPairs = store => listLevelStream(store.createReadStream());
export const listLevelKeys = store => listLevelStream(store.createKeyStream());
export const listLevelValues = store => listLevelStream(store.createValueStream());
