import uuidv4 from 'uuid/v4';
import { fromWib } from '../utils/wibson-lib/coin';
import { getBuyerInfo } from '../services/buyerInfo';
import { dataOrders } from '../utils/stores';
import { addTransactionJob } from '../queues/transactionQueue';

export async function createDataOrder({ buyerUrl, ...dataOrder }) {
  const id = uuidv4();
  const status = 'creating';
  const { termsHash } = await getBuyerInfo(dataOrder.buyerInfoId);
  dataOrders.put(id, {
    ...dataOrder,
    status,
    termsHash,
  });
  addTransactionJob('NewOrder', {
    price: fromWib(dataOrder.price),
    audience: JSON.stringify(dataOrder.audience),
    requestedData: JSON.stringify(dataOrder.requestedData),
    buyerUrl: `${buyerUrl}/orders/${id}`,
    termsAndConditionsHash: termsHash,
  });
  return { id, status };
}
