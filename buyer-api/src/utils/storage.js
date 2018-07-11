import asyncRedis from 'async-redis';
import redis from 'redis';
import level from 'level';
import config from '../../config';

const redisSocket = config.redis.socket;

export const createRedisStore = ns =>
  asyncRedis.decorate(redis.createClient(redisSocket, { prefix: ns }));

export const createLevelStore = ns => level(ns, (err, db) => {
  if (err) { throw new Error(err); }
  return db;
});
