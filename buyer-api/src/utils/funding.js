import { wibcoin, logger } from '.';
import web3 from './web3';
import config from '../../config';
import signingService from '../services/signingService';
import { coin } from '../utils/wibson-lib';
import { fundingQueue } from '../queues';

const minWib = web3.toBigNumber(config.buyerChild.minWib);
const maxWib = web3.toBigNumber(config.buyerChild.maxWib);
const minWei = web3.toBigNumber(config.buyerChild.minWei);
const maxWei = web3.toBigNumber(config.buyerChild.maxWei);

const getWeiBalance = async (address) => {
  const wei = await web3.eth.getBalance(address);
  return web3.toBigNumber(wei);
};

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

const missingChildBuyerFundsWei = async (address) => {
  const currentWei = await getWeiBalance(address);

  if (currentWei.greaterThan(maxWei)) {
    logger.alert(`Child account ${address} exceeds maximum ETH balance. Max: ${maxWei} WEI | Current: ${currentWei} WEI`);
  } else if (currentWei.lessThan(minWei)) {
    return maxWei.minus(currentWei);
  }

  return web3.toBigNumber(0);
};

const missingChildBuyerFundsWib = async (address) => {
  const currentWib = await getWibBalance(address);

  if (currentWib.greaterThan(maxWib)) {
    logger.alert(`Child account ${address} exceeds maximum WIB balance. Max: ${maxWib} | Current: ${currentWib}`);
  } else if (currentWib.lessThan(minWib)) {
    return maxWib.minus(currentWib);
  }

  return web3.toBigNumber(0);
};

const monitorFunds = async () => {
  logger.info('Starting funds monitor');
  const { root, children } = await signingService.getAccounts();

  let neededWei = web3.toBigNumber(0);
  let neededWib = web3.toBigNumber(0);
  const childrenToFundWei = [];
  const childrenToFundWib = [];

  children.forEach(async (child) => {
    const missingWei = await missingChildBuyerFundsWei(child.address);
    if (missingWei.greaterThan(0)) {
      neededWei = neededWei.plus(missingWei);
      childrenToFundWei.push(child);
    }

    const missingWib = await missingChildBuyerFundsWib(child.address);
    if (missingWib.greaterThan(0)) {
      neededWib = neededWib.plus(missingWib);
      childrenToFundWib.push(child);
    }
  });

  const rootBuyerFunds = await getFunds(root.address);

  if (rootBuyerFunds.wei.lessThan(neededWei)) {
    logger.alert(`
    Root Buyer (${root.address} is unable to fund ${childrenToFundWei.length} child accounts:
    Needed ETH: ${neededWei} WEI
    Root Buyer available ETH: ${rootBuyerFunds.wei} WEI
    (The needed ETH does not take into account transaction costs)
    `);
  }

  if (rootBuyerFunds.wib.lessThan(neededWib)) {
    logger.alert(`
    Root Buyer (${root.address} is unable to fund ${childrenToFundWib.length} child accounts:
    Needed WIB: ${neededWib}
    Root Buyer available WIB: ${rootBuyerFunds.wib}
    `);
  }

  childrenToFundWei.forEach(child => fundingQueue.add('transferETH', { accountNumber: child.number }));
  childrenToFundWib.forEach(child => fundingQueue.add('transferWIB', { accountNumber: child.number }));
};

export { checkInitialRootBuyerFunds, monitorFunds };
