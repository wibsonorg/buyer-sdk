import uuidv4 from 'uuid/v4';
import { fromWib } from '../utils/wibson-lib/coin';
import { getBuyerInfo } from '../services/buyerInfo';
import { dataOrders } from '../utils/stores';
import { addTransactionJob } from '../queues/transactionQueue';

export async function createDataOrder(dataOrder) {
  const id = uuidv4();
  const status = 'creating';
  const buyerUrl = `${dataOrder.buyerUrl}/orders/${id}`;
  const { termsHash } = await getBuyerInfo(dataOrder.buyerInfoId);
  const termsAndConditionsHash = termsHash.startsWith('0x') ? termsHash : `0x${termsHash}`;
  dataOrders.put(id, {
    ...dataOrder,
    status,
    buyerUrl,
    termsAndConditionsHash,
  });
  addTransactionJob('CreateDataOrder', {
    price: fromWib(dataOrder.price),
    audience: JSON.stringify(dataOrder.audience),
    requestedData: JSON.stringify(dataOrder.requestedData),
    buyerUrl,
    termsAndConditionsHash,
  });
  return { id, status };
}
