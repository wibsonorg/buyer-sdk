import uuidv4 from 'uuid/v4';
import { getBuyerInfo } from '../services/buyerInfo';
import { fromWib } from '../utils/wibson-lib/coin';
import { dataOrders } from '../utils/stores';

function enqueueTransaction() {}

export async function createDataOrder({ buyerUrl, ...dataOrder }) {
  const id = uuidv4();
  const status = 'creating';
  const { termsHash } = await getBuyerInfo(dataOrder.buyerInfoId);
  dataOrders.put(id, {
    ...dataOrder,
    status,
    termsHash,
  });
  enqueueTransaction('NewOrder', {
    price: fromWib(dataOrder.price),
    audience: JSON.stringify(dataOrder.audience),
    requestedData: JSON.stringify(dataOrder.requestedData),
    buyerUrl: `${buyerUrl}/orders/${id}`,
    termsAndConditionsHash: termsHash,
  });
  return { id, status };
}
