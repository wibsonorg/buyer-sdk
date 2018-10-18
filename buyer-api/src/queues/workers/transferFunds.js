import config from '../../../config';
import signingService from '../../services/signingService';
import {
  checkAndTransfer,
  getWeiBalance,
  getWibBalance,
} from '../../facades/transferFacade';
import { waitForExecution, sendTransaction } from '../../facades/helpers';
import {
  storeAccountMetrics,
  incrementAccountCounter,
} from '../../facades/metricsFacade';
import { web3, logger } from '../../utils';

const { signETHTransfer, signWIBTransfer } = signingService;

const toBN = num => web3.toBigNumber(num);

/**
 * Sends Funds to Buyer's child account and enqueues another job to check
 * the status of that transaction.
 *
 * @params {Object} job Job payload.
 */
export default async (job) => {
  const { root, child, currency } = job.data;

  const amounts = config.buyerChild;

  const [balanceFx, transferFx, minFunds, maxFunds] =
    currency === 'WIB'
      ? [getWibBalance, signWIBTransfer, amounts.minWib, amounts.maxWib]
      : [getWeiBalance, signETHTransfer, amounts.minWei, amounts.maxWei];

  const currentBalance = balanceFx(child.address).toString();
  const receipt = await checkAndTransfer(
    child,
    balanceFx,
    params => sendTransaction(web3, root, transferFx, params),
    toBN(minFunds),
    toBN(maxFunds),
  );

  const metrics = {};
  metrics[`${currency}:balance`] = balanceFx(child.address).toString();
  metrics[`${currency}:balanceDate`] = Date.now();
  await storeAccountMetrics(child, metrics);

  logger.debug(`Funding Queue :: transfer(${currency}) :: Child #${child.number} :: ${receipt}`);
  if (receipt) {
    logger.debug(`Funding Queue :: transfer(${currency}) :: Child #${child.number} :: waiting ...`);
    const waitOptions = { maxIterations: 30, interval: 30 };
    const transaction = await waitForExecution(web3, receipt, waitOptions);

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
