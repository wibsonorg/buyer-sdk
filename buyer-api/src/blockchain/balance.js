import { web3, logger } from '../utils';
import { Wibcoin } from './contracts';
import config from '../../config';
import { toWib } from '../utils/wibson-lib/coin';

const { toBN, fromWei } = web3.utils;
const minWib = toBN(config.balance.minWib);
const minWei = toBN(config.balance.minWei);

export const toEth = wei => Number(fromWei(wei.toString(), 'ether'));

export const getWeiBalance = async address =>
  toBN(await web3.eth.getBalance(address));
export const getWibBalance = async address =>
  toBN(await Wibcoin.methods.balanceOf(address).call());

export const getFunds = async (address) => {
  const [wei, wib] = await Promise.all([
    getWeiBalance(address),
    getWibBalance(address),
  ]);
  return { wei, wib };
};

export const getBalance = async (address) => {
  const [wei, wib] = await getFunds(address);
  return {
    address,
    balance: Number(wib),
    wib: toWib(wib, { decimals: 2 }),
    ether: web3.utils.fromWei(wei.toString(), 'ether'),
  };
};

/**
 * Checks that the account is able to operate.
 *
 * @async
 * @param {String} address Buyer's ethereum address.
 * @returns {Boolean} if root can fund correctly all accounts.
 */
export const hasEnoughBalance = async (address) => {
  const { wei, wib } = await getFunds(address);
  const insufficientEth = wei.lt(minWei);
  const insufficientWib = wib.lt(minWib);
  if (insufficientEth) {
    logger.error(`
    Buyer (${address}) does not have enough ETH.
    Current balance: ${wei} ETH
    Minimum balance: ${minWei} ETH
    `);
  }
  if (insufficientWib) {
    logger.error(`
    Buyer (${address}) does not have enough WIB.
    Current balance: ${wib} WIB
    Minimum balance: ${minWib} WIB
    `);
  }
  return !(insufficientEth || insufficientWib);
};
