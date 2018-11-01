import web3Utils from 'web3-utils';
import { logger, delay } from '../../utils';

/**
 * Suggests if an operation should be retried or not after specified error.
 *
 * Operation after error `Transaction was not mined within 50 blocks...` occurs
 * should be retried.
 * Operation after error `known transaction` occurs should be retried
 * (e.g., for an increaseApproval).
 * Operation after error `replacement transaction underpriced` occurs should be
 * retried (multiple tx intents will have the same nonce).
 *
 * @param {Error} error to check
 * @returns {Boolean} true if error should be retried, false otherwise.
 */
const retryAfterError = (error) => {
  const { failed } = error;

  const retry = !failed;

  return retry;
};

/**
 * @function getTransactionReceipt
 * @param {Object} web3 instance of Web3
 * @param {Sting} receipt transaction receipt
 * @returns {Promise} promise that will resolve to the transaction object if
 *                    successful or reject with an Error in any other case.
 */
const getTransactionReceipt = (web3, receipt) =>
  new Promise((resolve, reject) => {
    web3.eth.getTransactionReceipt(receipt, (err, result) => {
      if (err) {
        reject(err);
      } else if (!result) {
        const pendingError = new Error(`Pending tx: ${receipt}`);
        pendingError.pending = true;
        reject(pendingError);
      } else if (typeof result === 'object') {
        if (
          web3Utils.isHex(result.status) &&
          web3Utils.hexToNumber(result.status) === 1
        ) {
          resolve(result);
        } else {
          const failedError = new Error(`Failed tx: ${receipt}`);
          failedError.failed = true;
          reject(failedError);
        }
      } else {
        reject(new Error(`Unknown error for tx: ${receipt}`));
      }
    });
  });

// TODO: @nicoayala this function is never used, is it old code?
// /**
//  * NOTE: There is an alternative to handle this with `filters`.
//  * See https://goo.gl/VXv3zK (from ethereum.stackexchange.com)
//  */
// const transactionResponse = async (web3, receipt) => {
//   let response = null;
//   let iteration = 0;
//   const maxIterations = 12; // 2 min
//
//   while (!response && iteration < maxIterations) {
//     try {
//       iteration += 1;
//       await delay(10 * 1000); // eslint-disable-line no-await-in-loop
//       response = await getTransactionReceipt(web3, receipt);
// eslint-disable-line no-await-in-loop
//     } catch (error) {
//       if (!error.pending) {
//         throw error;
//       }
//     }
//   }
//
//   return response;
// };

/**
 * @async
 * @function sendTransaction
 * @param {Object} web3
 * @param {Sting} address issuer's ethereum address of the transaction
 * @param {Function} signingFunc function used to sign the transaction
 * @param {Object} params data payload needed in the transaction
 * @returns {String} transaction receipt
 */
const sendTransaction = async (
  web3,
  address,
  signingFunc,
  params,
  gasPrice,
) => {
  const nonce = await web3.eth.getTransactionCount(address);
  const payload = {
    nonce,
    gasPrice: gasPrice || web3.eth.gasPrice.toNumber(),
    params,
  };

  const { signedTransaction } = await signingFunc(payload);

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  logger.info(`[sendTransaction] receipt ${receipt}`);

  return receipt;
};

export {
  sendTransaction,
  getTransactionReceipt,
  retryAfterError,
};
