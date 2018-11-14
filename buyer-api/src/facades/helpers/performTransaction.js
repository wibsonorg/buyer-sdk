import { delay } from '../../utils';

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
          web3.utils.isHex(result.status) &&
          web3.utils.hexToNumber(result.status) === 1
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

const sendSignedTransaction = (web3, signedTransaction) =>
  new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(`0x${signedTransaction}`)
      .on('error', (error) => {
        reject(error);
      })
      .on('transactionHash', (hash) => {
        if (!hash) reject(new Error('No tx hash'));
        resolve(hash);
      });
  });

/**
 * @param {Object} web3 instance of Web3
 * @param {Sting} receipt transaction receipt
 * @returns {Promise} promise that resolves to the transaction object in any of
 *                    the following states: `pending`, `success` or `failure`.
 *                    Is reject if an error occurs.
 */
const getTransaction = (web3, receipt) =>
  new Promise((resolve, reject) => {
    web3.eth.getTransactionReceipt(receipt, (err, result) => {
      if (err) {
        reject(err);
      } else if (!result) {
        resolve({ status: 'pending' });
      } else if (result.status) {
        resolve({ ...result, status: 'success' });
      } else {
        resolve({ ...result, status: 'failure' });
      }
    });
  });

/**
 * @param {Object} web3 instance of Web3
 * @param {Sting} receipt transaction receipt
 * @param {Object} opts
 * @throws {Error} when `getTransaction` is rejected
 */
const waitForExecution = async (web3, receipt, opts = {}) => {
  const { maxIterations = 20, interval = 30 } = opts;
  let transaction = { status: 'pending' };
  let iteration = 0;

  while (transaction.status === 'pending' && iteration < maxIterations) {
    iteration += 1;
    // eslint-disable-next-line no-await-in-loop
    await delay(interval * 1000);
    // eslint-disable-next-line no-await-in-loop
    transaction = await getTransaction(web3, receipt);
  }

  return transaction;
};

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
  const ethGasPrice = await web3.eth.getGasPrice();
  const payload = {
    nonce,
    gasPrice: gasPrice || ethGasPrice.toString(),
    params,
  };

  const { signedTransaction } = await signingFunc(payload);

  const receipt = await sendSignedTransaction(web3, signedTransaction);

  return receipt;
};

export {
  sendTransaction,
  getTransaction,
  waitForExecution,
  getTransactionReceipt,
  retryAfterError,
};
