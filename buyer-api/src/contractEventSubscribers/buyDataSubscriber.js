import { enqueueCloseDataResponse } from '../queues';
import { logger } from '../utils';

const subscriberCallback = async ({ event, returnValues }) => {
  if (event === 'DataAdded') {
    const { seller, orderAddr } = returnValues;
    logger.debug(`[BuyData] closing ${JSON.stringify({ seller, orderAddr })}`);
    await enqueueCloseDataResponse(orderAddr, seller);
  }
};

export default {
  name: 'BuyData',
  callback: subscriberCallback,
  events: [
    'DataAdded',
    'TransactionCompleted',
  ],
};
