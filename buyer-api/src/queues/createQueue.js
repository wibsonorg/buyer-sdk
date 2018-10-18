import Queue from 'bull';
import { logger } from '../utils';

const PREFIX = 'buyer-api:jobs';

const createQueue = (queueName, opts = {}) => {
  const queue = new Queue(queueName, {
    prefix: PREFIX,
    settings: {
      backoffStrategies: {
        linear: attemptsMade => attemptsMade * 10 * 1000,
      },
    },
    ...opts,
  });

  const formatLog = ({ id, name }) => `[${PREFIX}:${queueName}:${id}][${name}]`;

  queue.on('failed', (job) => {
    logger.error(`${formatLog(job)} reason: ${job.failedReason}`);
  });

  queue.on('completed', (job) => {
    logger.info(`${formatLog(job)} completed`);
  });

  queue.formatLog = formatLog;

  return queue;
};

export { createQueue };

