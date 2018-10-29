import { createQueue } from './createQueue';
import { onIncreaseApprovalSent } from '../facades';

const balanceQueue = createQueue('BalanceQueue');

balanceQueue.process('increaseApprovalSent', async ({ data: { receipt } }) => {
  await onIncreaseApprovalSent(receipt);
});

export { balanceQueue };
