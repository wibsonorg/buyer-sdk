import { fundingQueue } from '../fundingQueue';
import signingService from '../../services/signingService';
import { checkAndTransfer } from '../../facades/transferFacade';
import { storeAccountMetrics } from '../../facades/metricsFacade';
import { sendTransaction } from '../../facades/helpers';
import { web3, wibcoin, logger } from '../../utils';

const { signWIBTransfer, getAccounts } = signingService;

const toBN = num => web3.toBigNumber(num);

const options = {
  priority: 10,
  attempts: 20,
  backoff: {
    type: 'linear',
  },
};

export default async ({ data: { accountNumber, config } }) => {
  const { root, children } = await getAccounts();
  const child = children[accountNumber];

  // gas used: 51769
  const receipt = await checkAndTransfer(
    child,
    wibcoin.balanceOf,
    params => sendTransaction(web3, root, signWIBTransfer, params),
    toBN(config.wib.min),
    toBN(config.wib.max),
  );

  await storeAccountMetrics(child, {
    'WIB:balance': wibcoin.balanceOf(child.address).toString(),
    'WIB:balanceDate': Date.now(),
  });

  fundingQueue.add('checkStatus', {
    currency: 'WIB',
    account: child,
    receipt,
    enqueueAfterConfirmation: {
      jobName: 'transferETH',
      payload: { accountNumber, config },
    },
  }, options);
};
