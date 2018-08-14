import Queue from 'bull';
import { logger } from '../utils';

const PREFIX = 'buyer-api:jobs';

const createQueue = (queueName) => {
  const queue = new Queue(queueName, {
    prefix: PREFIX,
    settings: {
      backoffStrategies: {
        linear: attemptsMade => attemptsMade * 10 * 1000,
      },
    },
  });

  queue.on('failed', ({
    id, name, attemptsMade, failedReason: reason,
  }) => {
    const fullJobId = `${PREFIX}:${queueName}:${id}`;
    logger.error(`[${fullJobId}][${name}][${attemptsMade}] reason: ${reason}`);
  });

  return queue;
};

export { createQueue };

