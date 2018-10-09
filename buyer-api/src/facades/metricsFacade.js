import { createRedisStore } from '../utils';

const storage = createRedisStore('metrics:');

const getAllMetrics = async () => {
  const rawMetrics = await storage.hvals('accounts');
  return rawMetrics.map(metrics => JSON.parse(metrics));
};

const storeAccountMetrics = async ({ address, number }, payload) => {
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

const incrementAccountCounter = async (account, counter) => {
  const result = await storage.incr(`accounts:${account.number}:${counter}`);
  return storeAccountMetrics(account, { [counter]: result });
};

export { getAllMetrics, storeAccountMetrics, incrementAccountCounter };
