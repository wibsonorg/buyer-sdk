import { BigNumber } from 'bignumber.js';
import { wibcoin, logger } from '../utils';
import web3 from '../utils/web3';
import config from '../../config';
import signingService from '../services/signingService';
import { coin } from '../utils/wibson-lib';
import { fundingQueue } from '../queues/fundingQueue';

const minWib = new BigNumber(config.buyerChild.minWib);
const maxWib = new BigNumber(config.buyerChild.maxWib);
const minWei = web3.utils.toBN(config.buyerChild.minWei);
const maxWei = web3.utils.toBN(config.buyerChild.maxWei);

const getWeiBalance = async (address) => {
  const result = await web3.eth.getBalance(address);
  return web3.utils.toBN(result);
};

const getWibBalance = async (address) => {
  const wibUnits = await wibcoin.methods.balanceOf(address).call();
  return coin.toWib(wibUnits);
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

  if (currentWei.gt(maxWei)) {
    logger.alert(`Child account ${child.address} exceeds maximum ETH balance. Max: ${maxWei} WEI | Current: ${currentWei} WEI`);
  }
  if (currentWib.isGreaterThan(maxWib)) {
    logger.alert(`Child account ${child.address} exceeds maximum WIB balance. Max: ${maxWib} | Current: ${currentWib}`);
  }

  const missingWei = currentWei.lt(minWei) ? maxWei.sub(currentWei) : web3.utils.toBN(0);
  const missingWib = currentWib.isLessThan(minWib) ? maxWib.minus(currentWib) : new BigNumber(0);

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
const checkAndTransfer = async (child, getBalance, currency, send, min, max) => {
  const balance = currency === 'ETH' ? await getBalance(child.address) : await getBalance(child.address).call();
  if (new BigNumber(balance).gte(min)) return false;

  return send({
    _to: child.address,
    _value: new BigNumber(max).minus(balance).toString(),
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
  const childrenCount = children.length;
  const requiredWib = new BigNumber(childrenCount).multipliedBy(minWib);
  const requiredWei = web3.utils.toBN(childrenCount).mul(minWei);

  const insufficientWib = rootFunds.wib.isLessThan(requiredWib);
  const insufficientEth = rootFunds.wei.lt(requiredWei);

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

  const neededWei = missingFunds.map(x => x.missingWei).reduce((x, y) => x.add(y));
  const neededWib = missingFunds.map(x => x.missingWib).reduce((x, y) => x.plus(y));

  const childrenToFundWei = missingFunds.filter(x => x.missingWei.gt(0));
  const childrenToFundWib = missingFunds.filter(x => x.missingWib.isGreaterThan(0));

  if (rootBuyerFunds.wei.lt(neededWei)) {
    logger.alert(`
    Root Buyer (${root.address}) is unable to fund ${childrenToFundWei.length} child accounts:
    Needed ETH: ${neededWei} WEI
    Root Buyer available ETH: ${rootBuyerFunds.wei} WEI
    (The needed ETH does not take into account transaction costs)
    `);
  }

  if (rootBuyerFunds.wib.isLessThan(neededWib)) {
    logger.alert(`
    Root Buyer (${root.address}) is unable to fund ${childrenToFundWib.length} child accounts:
    Needed WIB: ${neededWib}
    Root Buyer available WIB: ${rootBuyerFunds.wib}
    `);
  }

  childrenToFundWei.forEach(x => fundingQueue.add('transferFunds', { root, child: x.child, currency: 'ETH' }));
  childrenToFundWib.forEach(x => fundingQueue.add('transferFunds', { root, child: x.child, currency: 'WIB' }));
};

export {
  checkAndTransfer,
  checkInitialRootBuyerFunds,
  monitorFunds,
};
