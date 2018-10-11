import { wibcoin, logger } from '../utils';
import web3 from '../utils/web3';
import config from '../../config';
import signingService from '../services/signingService';
import { coin } from '../utils/wibson-lib';
import { fundingQueue } from '../queues/fundingQueue';

const minWib = web3.toBigNumber(config.buyerChild.minWib);
const maxWib = web3.toBigNumber(config.buyerChild.maxWib);
const minWei = web3.toBigNumber(config.buyerChild.minWei);
const maxWei = web3.toBigNumber(config.buyerChild.maxWei);

const getWeiBalance = async address =>
  web3.eth.getBalance(address);

const getWibBalance = async (address) => {
  const wibUnits = await wibcoin.balanceOf.call(address);
  return web3.toBigNumber(coin.toWib(wibUnits));
};

const getFunds = async (address) => {
  const currentWib = await getWibBalance(address);
  const currentWei = await getWeiBalance(address);

  return {
    wib: currentWib,
    wei: currentWei,
  };
};

const missingChildFunds = async (child) => {
  const currentWib = await getWibBalance(child.address);
  const currentWei = await getWeiBalance(child.address);

  if (currentWei.greaterThan(maxWei)) {
    logger.alert(`Child account ${child.address} exceeds maximum ETH balance. Max: ${maxWei} WEI | Current: ${currentWei} WEI`);
  }
  if (currentWib.greaterThan(maxWib)) {
    logger.alert(`Child account ${child.address} exceeds maximum WIB balance. Max: ${maxWib} | Current: ${currentWib}`);
  }

  const missingWei = currentWei.lessThan(minWei) ? maxWei.minus(currentWei) : web3.toBigNumber(0);
  const missingWib = currentWib.lessThan(minWib) ? maxWib.minus(currentWib) : web3.toBigNumber(0);

  return { child, missingWei, missingWib };
};


/**
 * Checks destinatary's balance and transfers funds if needed.
 *
 * @async
 * @param {String} child Buyer's child account ethereum address
 * @param {Function} getBalance Balance getter
 * @param {Number} min Minimum required balance
 * @param {Number} max Maximum allowed balance
 */
const checkAndTransfer = (child, getBalance, send, min, max) => {
  const balance = getBalance(child.address);
  if (balance.greaterThanOrEqualTo(min)) return false;

  return send({
    _to: child.address,
    _value: max.minus(balance).toString(),
  });
};

/**
 * Checks that root account is able to fund all children accounts.
 *
 * @returns {boolean} if root can fund correctly all accounts.
 */
const checkInitialRootBuyerFunds = async () => {
  const { root, children } = await signingService.getAccounts();

  const rootFunds = await getFunds(root.address);
  const childrenCount = web3.toBigNumber(children.length);
  const requiredWib = childrenCount.times(minWib);
  const requiredWei = childrenCount.times(minWei);

  const insufficientWib = rootFunds.wib.lessThan(requiredWib);
  const insufficientEth = rootFunds.wei.lessThan(requiredWei);

  if (insufficientWib) {
    logger.alert(`
    Root Buyer (${root.address}) does not have enough WIB to fund ${childrenCount} child accounts.
    Current balance: ${rootFunds.wib} WIB
    Required balance: ${requiredWib} WIB
    `);
  }
  if (insufficientEth) {
    logger.alert(`
    Root Buyer (${root.address}) does not have enough ETH to fund ${childrenCount} child accounts.
    Current balance: ${rootFunds.wei} Wei
    Required balance: ${requiredWei} Wei
    (The required balance does not take into account transaction costs)
    `);
  }

  return !(insufficientWib || insufficientEth);
};


/**
 * Monitors accounts balances and dispatches funding jobs if needed.
 */
const monitorFunds = async () => {
  logger.info('Starting funds monitor');
  const { root, children } = await signingService.getAccounts();
  const rootBuyerFunds = await getFunds(root.address);

  const missingFunds = await Promise.all(children.map(child => missingChildFunds(child)));

  const neededWei = missingFunds.map(x => x.missingWei).reduce((x, y) => x.plus(y));
  const neededWib = missingFunds.map(x => x.missingWib).reduce((x, y) => x.plus(y));

  const childrenToFundWei = missingFunds.filter(x => x.missingWei.greaterThan(0));
  const childrenToFundWib = missingFunds.filter(x => x.missingWib.greaterThan(0));

  if (rootBuyerFunds.wei.lessThan(neededWei)) {
    logger.alert(`
    Root Buyer (${root.address}) is unable to fund ${childrenToFundWei.length} child accounts:
    Needed ETH: ${neededWei} WEI
    Root Buyer available ETH: ${rootBuyerFunds.wei} WEI
    (The needed ETH does not take into account transaction costs)
    `);
  }

  if (rootBuyerFunds.wib.lessThan(neededWib)) {
    logger.alert(`
    Root Buyer (${root.address}) is unable to fund ${childrenToFundWib.length} child accounts:
    Needed WIB: ${neededWib}
    Root Buyer available WIB: ${rootBuyerFunds.wib}
    `);
  }

  childrenToFundWei.forEach(x => fundingQueue.add('transferETH', { accountNumber: x.child.number }));
  childrenToFundWib.forEach(x => fundingQueue.add('transferWIB', { accountNumber: x.child.number }));
};

export {
  checkAndTransfer,
  checkInitialRootBuyerFunds,
  monitorFunds,
};
