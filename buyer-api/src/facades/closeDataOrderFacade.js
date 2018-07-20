import Response from './Response';
import { extractEventArguments } from './helpers';
import web3 from '../utils/web3';
import signingService from '../services/signingService';

/**
 * @async
 * @param {String} orderAddr Order address to be closed.
 * @param {Object} contract DataExchange contract
 * @returns {Response} The result of the operation.
 */
const closeDataOrderFacade = async (orderAddr, contract) => {
  // TODO: are there any open data orders?
  const { address } = await signingService.getAccount();
  const nonce = await web3.eth.getTransactionCount(address);

  const { signedTransaction } = await signingService.signCloseOrder({
    nonce, orderAddr,
  });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  const { logs } = await web3.eth.getTransactionReceipt(receipt);
  const { orderAddr: orderAddress } = extractEventArguments('OrderClosed', logs, contract);

  return new Response({ orderAddress });
};

export default closeDataOrderFacade;
