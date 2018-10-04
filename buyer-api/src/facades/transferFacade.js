import { sendTransaction } from './helpers';
import signingService from '../services/signingService';
import { web3, token } from '../utils';

const { signWIBTransfer, signETHTransfer } = signingService;

export const toBN = num => web3.toBigNumber(num);

export const transferParams = (destinatary, balance, { min, max }) => {
  if (balance.greaterThan(min)) return false;

  return {
    _to: destinatary,
    _value: max.minus(balance).toString(),
  };
};

export const transferWIB = async (root, destinatary, config) => {
  const balance = token.balanceOf(destinatary);
  const params = transferParams(destinatary, balance, config);
  if (!params) return false;

  return sendTransaction(web3, root, signWIBTransfer, params);
};

export const transferETH = async (root, destinatary, config) => {
  const balance = web3.eth.getBalance(destinatary);
  const params = transferParams(destinatary, balance, config);
  if (!params) return false;

  return sendTransaction(web3, root, signETHTransfer, params);
};
