const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * @function getTransactionReceipt
 * @param {Object} web3 instance of Web3
 * @param {Sting} receipt transaction receipt
 * @returns {Promise} promise that will resolve to the transaction object if
 *                    successful or reject with an Error in any other case.
 */
export const getTransactionReceipt = (web3, receipt) =>
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

  /**
 * @param {Object} web3 instance of Web3
 * @param {Sting} receipt transaction receipt
 * @returns {Promise} promise that resolves to the transaction object in any of
 *                    the following states: `pending`, `success` or `failure`.
 *                    Is reject if an error occurs.
 */
export const getTransaction = (web3, receipt) =>
  new Promise((resolve, reject) => {
    web3.eth.getTransactionReceipt(receipt, (err, result) => {
      if (err) {
        reject(err);
      } else if (!result) {
        resolve({ status: 'pending' });
      } else if (web3.utils.hexToNumber(result.status)) {
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
export const waitForExecution = async (web3, receipt, opts = {}) => {
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
export const sendTransaction = async (
  web3,
  address,
  signingFunc,
  params,
  gasPrice,
) => {
  const { signedTransaction } = await signingFunc({
    nonce: await web3.eth.getTransactionCount(address),
    gasPrice: gasPrice || (await web3.eth.getGasPrice()).toString(),
    params,
  });
  return new Promise((res, rej) => {
    web3.eth.sendSignedTransaction(`0x${signedTransaction}`)
      .on('error', rej)
      .on('transactionHash', hash => (hash ? res(hash) : rej(new Error('No tx hash'))));
  });
};
