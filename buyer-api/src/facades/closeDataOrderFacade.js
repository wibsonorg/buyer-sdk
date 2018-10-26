import Response from './Response';
import { getSellersInfo } from './sellersFacade';
import { sendTransaction } from './helpers';
import { web3, dataOrderAt } from '../utils';
import signingService from '../services/signingService';
import config from '../../config';

/**
 * @async
 * @param {String} orderAddres
 * @returns {Array} Error messages
 */
const validate = async (orderAddres) => {
  let errors = [];
  const dataOrder = dataOrderAt(orderAddres);
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

  const { address } = await signingService.getAccount();

  const receipt = await sendTransaction(
    web3,
    address,
    signingService.signCloseOrder,
    { orderAddr },
    config.contracts.gasPrice.fast,
  );

  return new Response({ status: 'pending', receipt });
};

export default closeDataOrderFacade;
