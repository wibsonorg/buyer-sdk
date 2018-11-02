import { enqueueCloseDataResponse } from '../queues';

const subscriberCallback = async ({ event, returnValues }) => {
  if (event === 'DataAdded') {
    const { seller, orderAddr } = returnValues;
    await enqueueCloseDataResponse(orderAddr, seller);
  }
};

export default {
  name: 'BuyData',
  callback: subscriberCallback,
  events: [
    'DataAdded',
  ],
};
