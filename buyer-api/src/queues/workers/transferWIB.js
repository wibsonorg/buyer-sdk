import { fundingQueue } from '../fundingQueue';
import signingService from '../../services/signingService';
import { checkAndTransfer } from '../../facades/transferFacade';
import { storeAccountMetrics } from '../../facades/metricsFacade';
import { sendTransaction } from '../../facades/helpers';
import { web3, wibcoin } from '../../utils';
import config from '../../../config';

const { signWIBTransfer } = signingService;

const toBN = num => web3.toBigNumber(num);

const options = {
  priority: 10,
  attempts: 20,
  backoff: {
    type: 'exponential',
  },
};

/**
 * Sends WIB to Buyer's child account and enqueues another job to check
 * the status of that transaction. When the transaction's status is checked
 * a `transferETH` job is enqueued.
 *
 * @params {Object} job Job payload.
 */
export default async (job) => {
  const { root, child } = job.data;

  // gas used: 51769
  const receipt = await checkAndTransfer(
    child,
    wibcoin.balanceOf,
    params => sendTransaction(web3, root, signWIBTransfer, params),
    toBN(config.buyerChild.minWib),
    toBN(config.buyerChild.maxWib),
  );

  await storeAccountMetrics(child, {
    'WIB:balance': wibcoin.balanceOf(child.address).toString(),
    'WIB:balanceDate': Date.now(),
  });

  fundingQueue.add('checkStatus', {
    currency: 'WIB',
    account: child,
    receipt,
  }, options);
};
