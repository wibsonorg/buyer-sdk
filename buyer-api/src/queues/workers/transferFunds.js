import config from '../../../config';
import signingService from '../../services/signingService';
import { checkAndTransfer } from '../../facades/transferFacade';
import { fundingQueue } from '../fundingQueue';
import { sendTransaction } from '../../facades/helpers';
import { storeAccountMetrics } from '../../facades/metricsFacade';
import { web3, wibcoin } from '../../utils';

const { signETHTransfer, signWIBTransfer } = signingService;

const toBN = num => web3.utils.toBN(num);

const options = {
  attempts: 20,
};

/**
 * Sends Funds to Buyer's child account and enqueues another job to check
 * the status of that transaction.
 *
 * @params {Object} job Job payload.
 */
export default async (job) => {
  const { root, child, currency } = job.data;

  const amounts = config.buyerChild;

  const [balanceFx, transferFx, minFunds, maxFunds] = currency === 'WIB' ?
    [wibcoin.methods.balanceOf, signWIBTransfer, amounts.minWib, amounts.maxWib] :
    [web3.eth.getBalance, signETHTransfer, amounts.minWei, amounts.maxWei];

  const receipt = await checkAndTransfer(
    child,
    balanceFx,
    currency,
    params => sendTransaction(web3, root, transferFx, params),
    toBN(minFunds),
    toBN(maxFunds),
  );

  const metrics = {};
  metrics[`${currency}:balance`] = balanceFx(child.address).toString();
  metrics[`${currency}:balanceDate`] = Date.now();

  await storeAccountMetrics(child, metrics);

  fundingQueue.add('checkStatus', {
    currency,
    account: child,
    receipt,
  }, options);
};
