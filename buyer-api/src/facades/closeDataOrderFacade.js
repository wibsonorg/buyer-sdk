import Response from './Response';
import { getSellersInfo } from './sellersFacade';
import { sendTransaction } from './helpers';
import web3 from '../utils/web3';
import { DataOrderContract } from '../utils/contracts';
import signingService from '../services/signingService';

/**
 * @param {String} orderAddres
 * @returns {Array} Error messages
 */
const validate = async (orderAddres) => {
  let errors = [];
  const dataOrder = DataOrderContract.at(orderAddres);
  const sellers = await getSellersInfo(web3, dataOrder);

  if (!sellers.every(({ status }) => status === 'TransactionCompleted')) {
    errors = ['Order has pending data responses'];
  }

  return errors;
};

/**
 * @async
 * @param {String} orderAddr Order address to be closed.
 * @param {Object} contract DataExchange contract
 * @returns {Response} The result of the operation.
 */
const closeDataOrderFacade = async (orderAddr, contract) => {
  const errors = await validate(orderAddr, contract);

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const { address } = await signingService.getAccount();

  const receipt = await sendTransaction(
    web3,
    address,
    signingService.signCloseOrder,
    { orderAddr },
  );

  return new Response({ status: 'pending', receipt });
};

export default closeDataOrderFacade;
