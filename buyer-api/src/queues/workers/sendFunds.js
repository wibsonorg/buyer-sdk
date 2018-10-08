import { fundingQueue } from '../fundingQueue';

export default async ({ data: { accountNumber, config } }) => {
  fundingQueue.add('transferWIB', {
    accountNumber, config,
  }, {
    priority: 100,
    attempts: 20,
    backoff: {
      type: 'linear',
    },
  });
};
