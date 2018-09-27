import { createQueue } from './createQueue';
import { onIncreaseApprovalSent } from '../facades';

const createBalanceQueue = () => {
  const queue = createQueue('BalanceQueue');

  queue.process('increaseApprovalSent', async ({ data: { receipt } }) => {
    await onIncreaseApprovalSent(receipt);
  });

  return queue;
};

export { createBalanceQueue };
