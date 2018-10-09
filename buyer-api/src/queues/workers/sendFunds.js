import { fundingQueue } from '../fundingQueue';

export default async ({ data: { accountNumber, config } }) => {
  fundingQueue.add('transferWIB', {
    accountNumber, config,
  });
};
