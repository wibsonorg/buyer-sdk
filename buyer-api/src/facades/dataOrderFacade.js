import config from '../../config';
import { web3, createLevelStore } from '../utils';
import getContracts from '../contracts';
import generateKeyPair from '../support/crypto';
import { encodeJSON } from '../support/encoding';
import extractEventArguments from '../support/transaction';

const dataExchangeAddress = config.contracts.addresses.dataExchange;
const ordersStore = createLevelStore(config.orders.storePath);

const createDataOrder = async ({
  buyerAddress: from,
  filters,
  dataRequest,
  price,
  initialBudgetForAudits,
  termsAndConditions,
  buyerUrl,
}) => {
  const { dataExchange } = await getContracts({ web3, dataExchangeAddress });
  const { publicKey, privateKey } = await generateKeyPair();

  const transaction = await dataExchange.newOrder(
    encodeJSON(filters),
    dataRequest,
    price,
    initialBudgetForAudits,
    termsAndConditions,
    buyerUrl,
    publicKey,
    { from, gas: 3000000 },
  );
  const { orderAddress } = extractEventArguments(transaction);

  await ordersStore.put(`${orderAddress}.privateKey`, privateKey);

  return { orderAddress };
};

export default createDataOrder;
