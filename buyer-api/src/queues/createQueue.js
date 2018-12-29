import Queue from 'bull';
import config from '../../config';

const { url: redisUrl, prefix } = config.redis;

const PREFIX = `${prefix}:jobs`;

const createQueue = (queueName) => {
  const queue = new Queue(queueName, redisUrl, {
    prefix: PREFIX,
    settings: {
      backoffStrategies: {
        linear: attemptsMade => attemptsMade * 10 * 1000,
      },
    },
  });

  return queue;
};

export { createQueue };
