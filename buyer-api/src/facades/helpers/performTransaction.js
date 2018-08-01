const getGasPrice = web3 => new Promise((resolve, reject) => {
  web3.eth.getGasPrice((err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

/**
 * @async
 * @function performTransaction
 * @param {Object} web3
 * @param {Sting} address issuer's ethereum address of the transaction
 * @param {Function} signingFunc function used to sign the transaction
 * @param {Object} params data payload needed in the transaction
 * @returns
 */
const performTransaction = async (
  web3,
  address,
  signingFunc,
  params,
) => {
  const nonce = await web3.eth.getTransactionCount(address);
  const gasPrice = await getGasPrice(web3);

  const { signedTransaction } = await signingFunc({
    nonce: nonce + 1,
    gasPrice,
    params,
  });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);

  return web3.eth.getTransactionReceipt(receipt);
};

export { performTransaction }; // eslint-disable-line import/prefer-default-export

