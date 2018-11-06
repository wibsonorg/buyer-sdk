import Queue from 'bull';

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

  return queue;
};

export { createQueue };

