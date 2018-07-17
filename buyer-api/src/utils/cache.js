import apicache from 'apicache';
import redis from 'redis';
import config from '../../config';

const redisCache = () =>
  redis.createClient(config.redis.socket, { prefix: 'cache' });

const cache = apicache.options({
  enabled: config.cache.enabled,
  debug: false, // config.env !== 'production',
  redisClient: config.cache.adapter === 'redis' && redisCache(),
  statusCodes: {
    include: [200], // caches ONLY responses with a success/200 code)
  },
}).middleware;

export default cache;
