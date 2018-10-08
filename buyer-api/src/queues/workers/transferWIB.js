import { fundingQueue } from '../fundingQueue';
import signingService from '../../services/signingService';
import { checkAndTransfer } from '../../facades/transferFacade';
import { sendTransaction } from '../../facades/helpers';
import { web3, token } from '../../utils';

const { signWIBTransfer, getAccounts } = signingService;

const toBN = num => web3.toBigNumber(num);

const options = {
  priority: 10,
  attempts: 20,
  backoff: {
    type: 'linear',
  },
};

export default async ({ name, data: { accountNumber, config } }) => {
  const { root, children } = await getAccounts();
  const child = children[accountNumber];

  // gas used: 51769
  const receipt = await checkAndTransfer(
    child,
    token.balanceOf,
    params => sendTransaction(web3, root, signWIBTransfer, params),
    toBN(config.wib.min),
    toBN(config.wib.max),
  );

  fundingQueue.add('checkStatus', {
    name,
    receipt,
    enqueueAfterConfirmation: {
      jobName: 'transferETH',
      payload: { accountNumber, config },
      options,
    },
  }, options);
};
