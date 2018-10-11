import { fundingQueue } from '../fundingQueue';
import signingService from '../../services/signingService';
import { storeAccountMetrics } from '../../facades/metricsFacade';
import { checkAndTransfer } from '../../facades/transferFacade';
import { sendTransaction } from '../../facades/helpers';
import { web3 } from '../../utils';
import config from '../../../config';

const { signETHTransfer, getAccounts } = signingService;

const toBN = num => web3.toBigNumber(num);

const options = {
  priority: 10,
  attempts: 20,
  backoff: {
    type: 'linear',
  },
};

/**
 * Sends ETH to Buyer's child account and enqueues another job to check
 * the status of that transaction.
 *
 * @params {Number} data.accountNumber Child account number.
 * @params {Object} data.config Configuration to check for required balance.
 */
export default async ({ data: { accountNumber } }) => {
  const { root, children } = await getAccounts();
  const child = children[accountNumber];

  // gas used: 21000
  const receipt = await checkAndTransfer(
    child,
    web3.eth.getBalance,
    params => sendTransaction(web3, root, signETHTransfer, params),
    toBN(config.buyerChild.minWei),
    toBN(config.buyerChild.maxWei),
  );

  await storeAccountMetrics(child, {
    'ETH:balance': web3.eth.getBalance(child.address).toString(),
    'ETH:balanceDate': Date.now(),
  });

  fundingQueue.add('checkStatus', {
    currency: 'ETH',
    account: child,
    receipt,
  }, options);
};
