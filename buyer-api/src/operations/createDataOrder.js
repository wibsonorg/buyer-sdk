import uuidv4 from 'uuid/v4';
import { fromWib } from '../utils/wibson-lib/coin';
import { getBuyerInfo } from '../services/buyerInfo';
import { dataOrders } from '../utils/stores';
import { addTransactionJob } from '../queues/transactionQueue';

/**
 * @typedef BuyerInfoType
 * @property {string} buyerInfoId buyerId to get information of the buyer
 * @typedef {import('../utils/stores').DataOrder & BuyerInfoType} NewDataOrder

 * @typedef DataOrderStatusResult
 * @property {string} id uuid of the DataOrder been created
 * @property {string} status Current status of the DataOrder

 * @function createDataOrder
      Send a DataOrder to be created on the DataExchange and
      stores it with creating status
 * @param {NewDataOrder} dataOrder
 * @returns {DataOrderStatusResult}
 */
export async function createDataOrder(dataOrder) {
  const id = uuidv4();
  const status = 'creating';
  const buyerUrl = `${dataOrder.buyerUrl}/orders/${id}/offchain-data`;
  const { termsHash } = await getBuyerInfo(dataOrder.buyerInfoId);
  const termsAndConditionsHash = termsHash.startsWith('0x') ? termsHash : `0x${termsHash}`;
  const notariesAddresses = dataOrder.notariesAddresses.map(n => n.toLowerCase());
  await dataOrders.store(id, {
    ...dataOrder,
    status,
    buyerUrl,
    termsAndConditionsHash,
    notariesAddresses,
  });
  await addTransactionJob('CreateDataOrder', {
    price: fromWib(dataOrder.price),
    audience: JSON.stringify(dataOrder.audience),
    requestedData: JSON.stringify(dataOrder.requestedData),
    buyerUrl,
    termsAndConditionsHash,
  });
  return { id, status };
}
