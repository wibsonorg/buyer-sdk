import redis from 'redis';
import asyncRedis from 'async-redis';
import Web3 from 'web3';
import loadEnv from '../src/utils/wibson-lib/loadEnv';
import { getTransactionReceipt } from '../src/facades/helpers/performTransaction.js';

const getEnv = async () => {
  await loadEnv();
  return process.env;
};

const retryJob = async (web3, redisClient, jobType, jobId) => {
  const job = await redisClient.hgetall(jobType.replace('failed', jobId));
  const { name, failedReason, priority, opts, delay, attemptsMade } = job;
  const data = JSON.parse(job.data);

  if (attemptsMade >= 20) { // DO not hardcode this
    if (failedReason.toLowerCase().includes('pending')) {
      try {
        const txReceipt = await getTransactionReceipt(web3, data.receipt);
        console.log(txReceipt);
        // await redisClient.zrem(jobType, jobId);
      } catch (err) {
        console.log(err.pending)
        // enqueue new job
      }
    }
  }
};

const retryJobs = async (web3, redisClient, jobType) => {
  const failedJobs = await redisClient.zrange(jobType, 0, -1);
  await Promise.all(failedJobs.map(jobId => retryJob(web3, redisClient, jobType, jobId)));
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
  const env = await getEnv();
  const web3 = new Web3(env.WEB3_PROVIDER);
  const redisClient = asyncRedis.decorate(redis.createClient(env.REDIS_SOCKET));

  const failedJobTypes = await getFailedJobTypes(redisClient);
  await Promise.all(failedJobTypes.map(jobType => retryJobs(web3, redisClient, jobType)));
};

run();
