import EthTx from 'ethereumjs-tx';
import web3Utils from 'web3-utils';
import { Buffer } from 'safe-buffer';

const signTransaction = (privateKey, {
  from,
  to,
  value = '0x00',
  nonce,
  gasPrice,
  gasLimit,
  chainId,
  data,
}) => {
  let rawTransaction = {
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    value,
    nonce: web3Utils.numberToHex(nonce),
    gasPrice: web3Utils.numberToHex(gasPrice),
    gasLimit: web3Utils.numberToHex(gasLimit),
    data,
  };

  if (chainId) rawTransaction = { ...rawTransaction, chainId: Number(chainId) };

  const tx = new EthTx(rawTransaction);
  tx.sign(Buffer.from(privateKey.replace('/^0x/', ''), 'hex'));

  return tx.serialize().toString('hex');
};

export default signTransaction;
