import { createRedisStore } from '../utils';

const storage = createRedisStore('metrics:');

/**
 * Returns metrics for all accounts.
 * @async
 */
const getAllMetrics = async () => {
  const rawMetrics = await storage.hvals('accounts');
  return rawMetrics.map(metrics => JSON.parse(metrics));
};

/**
 * Store metrics for a specific account.
 *
 * @async
 * @param {Object} account Buyer's child account
 * @param {Object} payload Metrics to be persisted
 */
const storeAccountMetrics = async (account, payload) => {
  const { address, number } = account;
  let rawMetrics = {};
  try {
    rawMetrics = await storage.hget('accounts', number);
    rawMetrics = JSON.parse(rawMetrics);
  } catch (error) {
    // Do nothing
  }
  const metrics = {
    address, number, ...rawMetrics, ...payload,
  };
  await storage.hset('accounts', number, JSON.stringify(metrics));
  return metrics;
};

/**
 * Increments a specific counter for that account.
 *
 * @async
 * @param {Object} account Buyer's child account
 * @param {String} counter Counter to be increased
 */
const incrementAccountCounter = async (account, counter) =>
  storage.incr(`accounts:${account.number}:${counter}`);

export { getAllMetrics, storeAccountMetrics, incrementAccountCounter };
