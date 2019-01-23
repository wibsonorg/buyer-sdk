import Queue from 'bull';
import config from '../../config';

const { redis: { url, prefix } } = config;

const PREFIX = `${prefix || 'buyer-api'}:jobs`;

const createQueue = (queueName) => {
  const queue = new Queue(queueName, url, {
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
