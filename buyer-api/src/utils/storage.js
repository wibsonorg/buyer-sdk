import redis from 'async-redis';
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

const redisClient = namespace =>
  redis.createClient(config.redis.socket, { prefix: namespace });

// TODO: Delete me, just for testing.
const getRedisStore = () => redisClient('sample');
const getLevelStore = () => new LevelDB('/tmp/sample_level');

export {
  getRedisStore,
  getLevelStore,
};
