import { enqueueCloseDataResponse } from '../queues';
import { dataOrderAt } from '../utils';
import { signingService } from '../services';

const subscriberCallback = async ({ event, returnValues }) => {
  if (event === 'DataAdded') {
    const { seller, orderAddr } = returnValues;

    const dataOrder = dataOrderAt(orderAddr);
    const orderBuyer = await dataOrder.methods.buyer().call();
    const { address } = await signingService.getAccount();

    if (orderBuyer.toLowerCase() === address.toLowerCase()) {
      await enqueueCloseDataResponse(orderAddr, seller);
    }
  }
};

export default {
  name: 'BuyData',
  callback: subscriberCallback,
  events: [
    'DataAdded',
  ],
};
