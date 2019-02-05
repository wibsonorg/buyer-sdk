import Queue from 'bull';
import config from '../../config';
import logger from '../utils/logger';

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

createQueue.logger = logger;
