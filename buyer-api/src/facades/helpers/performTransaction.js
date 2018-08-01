import web3Utils from 'web3-utils';

const getGasPrice = web3 => new Promise((resolve, reject) => {
  web3.eth.getGasPrice((err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

const getTransactionReceipt = (web3, receipt, seconds) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
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
            reject(new Error(`Failed tx: ${receipt}`));
          }
        } else {
          reject(new Error(`Unknown error for tx: ${receipt}`));
        }
      });
    }, seconds * 1000);
  });

const transactionResponse = async (web3, receipt) => {
  let response = null;
  let iteration = 0;
  const iterationInterval = 10; // seconds
  const maxIterations = 12; // 2 min

  while (!response && iteration < maxIterations) {
    try {
      iteration += 1;
      response = {
        tx: await getTransactionReceipt(web3, receipt, iterationInterval),
      };
    } catch (error) {
      if (!error.pending) {
        response = {
          error: error.message,
        };
      }
    }
  }

  return response;
};

/**
 * @async
 * @function performTransaction
 * @param {Object} web3
 * @param {Sting} address issuer's ethereum address of the transaction
 * @param {Function} signingFunc function used to sign the transaction
 * @param {Object} params data payload needed in the transaction
 * @returns {Object} { error: String, tx: Object }
 */
const performTransaction = async (
  web3,
  address,
  signingFunc,
  params,
) => {
  const nonce = await web3.eth.getTransactionCount(address);
  const gasPrice = await getGasPrice(web3);

  console.log('[performTransaction] payload', {
    nonce: nonce + 1,
    gasPrice: gasPrice.toNumber(),
    params,
  });

  const { signedTransaction } = await signingFunc({
    nonce,
    gasPrice: gasPrice.toNumber(),
    params,
  });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  console.log('[performTransaction] receipt', receipt);

  const response = await transactionResponse(web3, receipt);

  return response;
};

export { performTransaction }; // eslint-disable-line import/prefer-default-export

