import asyncRedis from 'async-redis';
import redis from 'redis';
import level from 'level';
import config from '../../config';

class LevelDB {
  constructor(path) {
    this.db = level(path, (err, db) => {
      if (err) { throw new Error(err); }

      return db;
    });
  }
}

const redisSocket = config.redis.socket;
const redisClient = ns =>
  asyncRedis.decorate(redis.createClient(redisSocket, { prefix: ns }));

// TODO: Delete me, just for testing.
const getRedisStore = () => redisClient('sample');
const getLevelStore = () => new LevelDB('/tmp/sample_level');

export {
  redisClient,
  getRedisStore,
  getLevelStore,
};
