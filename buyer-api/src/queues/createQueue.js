import Queue from 'bull';
import config from '../../config';

const { url, prefix } = config.redis;
export const createQueue = name => new Queue(name, url, {
  prefix: `${prefix}:jobs`,
  defaultJobOptions: {
    backoff: { type: 'linear' },
    attempts: 20,
  },
  settings: {
    backoffStrategies: {
      linear: attemptsMade => attemptsMade * 10 * 1000,
    },
  },
});
