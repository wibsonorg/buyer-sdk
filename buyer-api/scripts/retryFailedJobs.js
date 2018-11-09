import redis from 'redis';
import asyncRedis from 'async-redis';
import loadEnv from '../src/utils/wibson-lib/loadEnv';

const createRedisClient = async () => {
  await loadEnv();
  const redisSocket = process.env.REDIS_SOCKET; // Hack
  return asyncRedis.decorate(redis.createClient(redisSocket));
};

const retryJob = async (redisClient, jobType, jobId) => {
  const job = await redisClient.hgetall(jobType.replace('failed', jobId));
};

const retryJobs = async (redisClient, jobType) => {
  const failedJobs = await redisClient.zrange(jobType, 0, -1);
  await Promise.all(failedJobs.map(jobId => retryJob(redisClient, jobType, jobId)));
};

const run = async () => {
  const redisClient = await createRedisClient();

  const failedJobTypes = await redisClient.keys('buyer-api:jobs:*:failed');
  await Promise.all(failedJobTypes.map(jobType => retryJobs(redisClient, jobType)));
};

run();
