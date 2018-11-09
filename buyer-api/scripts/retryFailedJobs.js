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
  const {
    name, data, failedReason, priority, opts, delay, attemptsMade,
  } = job;

  if (attemptsMade >= 20) { // DO not hardcode this
    if (failedReason.toLowerCase().includes('pending')) {
      try {
        // await getTransactionReceipt(data.receipt);
        await redisClient.zrem(jobType, jobId);
      } catch (err) {
        // enqueue new job
      }
    }
  }
};

const retryJobs = async (redisClient, jobType) => {
  const failedJobs = await redisClient.zrange(jobType, 0, -1);
  await Promise.all(failedJobs.map(jobId => retryJob(redisClient, jobType, jobId)));
};

// We do this because it's not recommended to use KEYS in production environments.
const getFailedJobTypes = async (redisClient) => {
  let cursor = 0;
  let failedJobTypes = [];

  do {
    const [newCursor, results] =
      await redisClient.scan(cursor, 'MATCH', 'buyer-api:jobs:*:failed', 'COUNT', 1000);

    cursor = newCursor;
    failedJobTypes = failedJobTypes.concat(results);
  } while (cursor > 0);

  return failedJobTypes;
};

const run = async () => {
  const redisClient = await createRedisClient();

  const failedJobTypes = await getFailedJobTypes(redisClient);
  await Promise.all(failedJobTypes.map(jobType => retryJobs(redisClient, jobType)));
};

run();
