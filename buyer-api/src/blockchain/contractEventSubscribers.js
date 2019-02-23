import apicache from 'apicache';
import { contractEventListener } from './contractEventListener';
import { DataExchange, Wibcoin } from './contracts';
import { fetchDataOrder } from './dataOrder';
import { getAccount } from '../services/signingService';
import { dataOrders } from '../utils/stores';
import { sendDeposit } from '../recurrent/checkBatPayBalance';

export { contractEventListener };
const statusOrder = {
  creating: 0,
  created: 1,
  closing: 2,
  closed: 3,
};
/**
 * @typedef DataOrderEventValues
 * @property {string} owner The buyer that created the DataOrder
 * @property {number} orderId The DataExchange id of the DataOrder

 * @callback dataOrderUpdater Updates DataOrder in the store with data from the DataExchange
 * @param {DataOrderEventValues} eventValues The values emmited by the DataExchange event

 * @function createDataOrderUpdater Creates a dataOrderUpdater with the given status
 * @param {string} status The status to be set by the updater
 * @returns {dataOrderUpdater}
 */
const createDataOrderUpdater = status => async ({ owner, orderId: dxId }, { transactionHash }) => {
  const { address } = await getAccount();
  if (address.toLowerCase() === owner.toLowerCase()) {
    const { buyer, ...chainOrder } = await fetchDataOrder(dxId);
    const id = chainOrder.buyerUrl.match(/\/orders\/(.+)\/offchain-data/)[1];
    const storedOrder = await dataOrders.fetch(id);
    if (statusOrder[storedOrder.status] < statusOrder[status]) {
      await dataOrders.store(id, {
        ...storedOrder,
        ...chainOrder,
        dxId,
        transactionHash,
        status,
      });
      apicache.clear('/orders/*');
    }
  }
};

contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', createDataOrderUpdater('created'))
  .on('DataOrderClosed', createDataOrderUpdater('closed'))
  .addContract(Wibcoin)
  .on('Approval', sendDeposit)
;
