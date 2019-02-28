// TODO: DEPRECATED
import Response from './Response';
import { getSellersInfo } from './sellersFacade';
import { enqueueTransaction } from '../queues';
import { web3 } from '../utils';
import { getAccount } from '../services/signingService';
import config from '../../config';

const dataOrderAt = () => 0;

/**
 * @async
 * @param {String} orderAddres
 * @returns {Array} Error messages
 */
const validate = async (orderAddress) => {
  let errors = [];
  const dataOrder = dataOrderAt(orderAddress);
  const sellers = await getSellersInfo(web3, dataOrder);

  if (!sellers.every(({ status }) => status === 'TransactionCompleted')) {
    errors = ['Order has pending data responses'];
  }

  return errors;
};

/**
 * @async
 * @param {String} orderAddr Order address to be closed.
 * @returns {Response} The result of the operation.
 */
const closeDataOrderFacade = async (orderAddr) => {
  const errors = await validate(orderAddr);

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const account = await getAccount();

  enqueueTransaction(
    account,
    'CloseOrder',
    { orderAddr },
    config.contracts.gasPrice.fast,
  );

  return new Response({ status: 'pending' });
};

export default closeDataOrderFacade;
