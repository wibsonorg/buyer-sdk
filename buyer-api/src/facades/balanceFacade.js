import { web3, logger, wibcoin } from '../utils';
import config from '../../config';

const minWib = web3.utils.toBN(config.balance.minWib);
const minWei = web3.utils.toBN(config.balance.minWei);

const getWeiBalance = async address =>
  web3.utils.toBN(await web3.eth.getBalance(address));

const getWibBalance = async address =>
  web3.utils.toBN(await wibcoin.methods.balanceOf(address).call());

const getFunds = async (address) => {
  const currentWib = await getWibBalance(address);
  const currentWei = await getWeiBalance(address);

  return {
    wib: currentWib,
    wei: currentWei,
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

  const insufficientWib = wib.lt(minWib);
  const insufficientEth = wei.lt(minWei);

  if (insufficientWib) {
    logger.error(`
    Buyer (${address}) does not have enough WIB.
    Current balance: ${wib} WIB
    Minimum balance: ${minWib} WIB
    `);
  }

  if (insufficientEth) {
    logger.error(`
    Buyer (${address}) does not have enough ETH.
    Current balance: ${wei} ETH
    Minimum balance: ${minWei} ETH
    `);
  }

  return !(insufficientWib || insufficientEth);
};
