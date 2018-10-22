import { wibcoin, logger } from '../utils';
import web3 from '../utils/web3';
import config from '../../config';
import signingService from '../services/signingService';
import { coin } from '../utils/wibson-lib';
import { fundingQueue } from '../queues/fundingQueue';
import { waitForExecution, sendTransaction } from './helpers';
import { storeAccountMetrics, incrementAccountCounter } from './metricsFacade';

const { signETHTransfer, signWIBTransfer } = signingService;

const toBN = num => web3.toBigNumber(num);

const minWib = toBN(config.buyerChild.minWib);
const maxWib = toBN(config.buyerChild.maxWib);
const minWei = toBN(config.buyerChild.minWei);
const maxWei = toBN(config.buyerChild.maxWei);

const getWeiBalance = address => web3.eth.getBalance(address);

const getWibBalance = (address) => {
  const wibUnits = wibcoin.balanceOf.call(address);
  return toBN(coin.toWib(wibUnits));
};

const getFunds = (address) => {
  const currentWib = getWibBalance(address);
  const currentWei = getWeiBalance(address);

  return {
    wib: currentWib,
    wei: currentWei,
  };
};

const missingChildFunds = (child) => {
  const currentWib = getWibBalance(child.address);
  const currentWei = getWeiBalance(child.address);

  if (currentWei.greaterThan(maxWei)) {
    logger.alert(`Child account ${
      child.address
    } exceeds maximum ETH balance. Max: ${maxWei} WEI | Current: ${currentWei} WEI`);
  }
  if (currentWib.greaterThan(maxWib)) {
    logger.alert(`Child account ${
      child.address
    } exceeds maximum WIB balance. Max: ${maxWib} | Current: ${currentWib}`);
  }

  const missingWei = currentWei.lessThan(minWei)
    ? maxWei.minus(currentWei)
    : toBN(0);
  const missingWib = currentWib.lessThan(minWib)
    ? maxWib.minus(currentWib)
    : toBN(0);

  return { child, missingWei, missingWib };
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
    Root Buyer (${
  root.address
}) does not have enough WIB to fund ${childrenCount} child accounts.
    Current balance: ${rootFunds.wib} WIB
    Required balance: ${requiredWib} WIB
    `);
  }
  if (insufficientEth) {
    logger.alert(`
    Root Buyer (${
  root.address
}) does not have enough ETH to fund ${childrenCount} child accounts.
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

  const neededWei = missingFunds
    .map(x => x.missingWei)
    .reduce((x, y) => x.plus(y));
  const neededWib = missingFunds
    .map(x => x.missingWib)
    .reduce((x, y) => x.plus(y));

  const childrenToFundWei = missingFunds.filter(x =>
    x.missingWei.greaterThan(0));
  const childrenToFundWib = missingFunds.filter(x =>
    x.missingWib.greaterThan(0));

  if (rootBuyerFunds.wei.lessThan(neededWei)) {
    logger.alert(`
    Root Buyer (${root.address}) is unable to fund ${
  childrenToFundWei.length
} child accounts:
    Needed ETH: ${neededWei} WEI
    Root Buyer available ETH: ${rootBuyerFunds.wei} WEI
    (The needed ETH does not take into account transaction costs)
    `);
  }

  if (rootBuyerFunds.wib.lessThan(neededWib)) {
    logger.alert(`
    Root Buyer (${root.address}) is unable to fund ${
  childrenToFundWib.length
} child accounts:
    Needed WIB: ${neededWib}
    Root Buyer available WIB: ${rootBuyerFunds.wib}
    `);
  }

  // childrenToFundWei.forEach(x =>
  //   fundingQueue.add('transferFunds', { root, child: x.child, currency: 'ETH' }) );
  childrenToFundWib.forEach(x =>
    fundingQueue.add('transferFunds', { root, child: x.child, currency: 'WIB' }));
};

/**
 *
 * @param {*} root
 * @param {*} child
 * @param {*} currency
 * @param {*} amounts
 */
const transfer = async (root, child, currency, amounts) => {
  const [balanceFx, transferFx, minFunds, maxFunds] =
    currency === 'WIB'
      ? [getWibBalance, signWIBTransfer, amounts.minWib, amounts.maxWib]
      : [getWeiBalance, signETHTransfer, amounts.minWei, amounts.maxWei];

  const balance = balanceFx(child.address);
  if (balance.greaterThanOrEqualTo(minFunds)) return false;

  const receipt = await sendTransaction(web3, root, transferFx, {
    _to: child.address,
    _value: coin.fromWib(maxFunds.minus(balance).toString()), // FIX THIS FOR ETH
  });

  const metrics = {};
  metrics[`${currency}:balance`] = balanceFx(child.address).toString();
  metrics[`${currency}:balanceDate`] = Date.now();
  await storeAccountMetrics(child, metrics);

  if (receipt) {
    logger.debug(`Funding Queue :: transfer(${currency}) :: Child #${child.number} :: waiting ...`);
    const waitOptions = { maxIterations: 30, interval: 30 };
    const transaction = await waitForExecution(web3, receipt, waitOptions);
    const currentBalance = balance.toString();

    switch (transaction.status) {
      case 'success': {
        logger.debug(`Funding Queue :: transfer(${currency}) :: Child #${child.number} :: SUCCESS`);
        const timesSucceeded = await incrementAccountCounter(
          child,
          `${currency}:timesSucceeded`,
        );
        await storeAccountMetrics(child, {
          [`${currency}:lastFundDate`]: Date.now(),
          [`${currency}:timesSucceeded`]: timesSucceeded,
        });
        break;
      }
      case 'failure': {
        logger.debug(`Funding Queue :: transfer(${currency}) :: Child #${child.number} :: FAILURE`);
        const message = `
        Transfer of ${currency} failed (it will not be retried).
        Root Buyer (${root.address}) couldn't send funds to ${child.address}.
        Current balance: ${currentBalance} ${currency}
        `;
        logger.alert(message);
        break;
      }
      case 'pending': {
        logger.debug(`Funding Queue :: transfer(${currency}) :: Child #${child.number} :: PENDING`);
        const message = `
        Transfer of ${currency} did not finished.
        Root Buyer (${root.address}) couldn't send funds to ${child.address}.
        Current balance: ${currentBalance} ${currency}.
        Wait configuration: ${JSON.stringify(waitOptions)}
        `;
        throw new Error(message);
      }
      default: {
        const message = `
        Transfer of ${currency} failed.
        Root Buyer (${root.address}) couldn't send funds to ${child.address}.
        Current balance: ${currentBalance} ${currency}.
        Unknown transaction status.
        `;
        logger.alert(message);
        throw new Error(message);
      }
    }
  }
};

export {
  transfer,
  checkInitialRootBuyerFunds,
  monitorFunds,
  getWeiBalance,
  getWibBalance,
};
