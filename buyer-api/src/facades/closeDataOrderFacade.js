import Response from './Response';
import { getSellersInfo } from './sellersFacade';
import { extractEventArguments } from './helpers';
import { web3, DataOrderContract, dataExchange } from '../utils';
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
 * @returns {Response} The result of the operation.
 */
const closeDataOrderFacade = async (orderAddr) => {
  const errors = await validate(orderAddr);

  if (errors.length > 0) {
    return new Response(null, errors);
  }

  const { address } = await signingService.getAccount();
  const nonce = await web3.eth.getTransactionCount(address);

  const { signedTransaction } = await signingService.signCloseOrder({
    nonce, orderAddr,
  });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  const { logs } = await web3.eth.getTransactionReceipt(receipt);
  const { orderAddr: orderAddress } = extractEventArguments('OrderClosed', logs, dataExchange);

  return new Response({ orderAddress });
};

export default closeDataOrderFacade;
