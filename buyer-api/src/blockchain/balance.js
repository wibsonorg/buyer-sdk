import { web3, logger } from '../utils';
import { Wibcoin, BatPay } from './contracts';
import config from '../../config';
import { toWib } from '../utils/wibson-lib/coin';

const { toBN, fromWei } = web3.utils;
const minWib = toBN(config.balance.minWib);
const minWei = toBN(config.balance.minWei);
const minBatPay = toBN(config.balance.minBatPay);

export const toEth = wei => Number(fromWei(wei.toString(), 'ether'));

export const getWeiBalance = async address => toBN(await web3.eth.getBalance(address));
export const getWibBalance = async address => toBN(await Wibcoin.methods.balanceOf(address).call());
export const getBatPayBalance = async id => toBN(await BatPay.methods.balanceOf(id).call());

export const getFunds = async (address) => {
  const [wei, wib] = await Promise.all([getWeiBalance(address), getWibBalance(address)]);
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

/**
 * @async
 * @function hasEnoughBatPayBalance
 *  Checks if account's balance in BatPay is less than `amount`.
 *  If no `amount` is supplied it will fallback to the configured one via ENV.
 * @param {number} id Subject's ID in BatPay
 * @param {?BigNumber} amount Amount to test with the current balance.
 * @returns {Boolean} `true` if has enough balance, `false` otherwise.
 */
export const hasEnoughBatPayBalance = async (id, amount = minBatPay) => {
  const batPay = await getBatPayBalance(id);
  const enough = batPay.gt(amount);

  if (!enough) {
    logger.error(`
    BatPay.Account '${id}' does not have enough WIB.
    Current balance: ${batPay} WIB
    Minimum balance: ${amount} WIB
    `);
  }

  return enough;
};

/**
 * @typedef Account
 * @property {string} role Account's role (`seller`, `buyer` or `notary`)
 * @property {string} address Account's Ethereum address
 * @property {number} id Account's BatPay ID
 *
 * @async
 * @function hasBatPayEnoughTokenAllowance
 *  Checks if BatPay contract is able to take `amount` from `account`.
 *  If no `amount` is supplied it will fallback to the configured one via ENV.
 * @param {Account} account Subject's account
 * @param {?BigNumber} amount Amount to test with the current allowance.
 * @returns {Boolean} `true` if has enough allowance, `false` otherwise.
 */
export const hasBatPayEnoughTokenAllowance = async (account, amount = minBatPay) => {
  const { address, role } = account;
  const batPay = toBN(await Wibcoin.methods.allowance(address, BatPay.options.address).call());
  const enough = batPay.gt(amount);

  if (!enough) {
    logger.error(`
    BatPay does not have enough allowance to spend WIB from Account (${role} '${address}') .
    Current allowance: ${batPay} WIB
    Minimum allowance: ${amount} WIB
    `);
  }

  return enough;
};
