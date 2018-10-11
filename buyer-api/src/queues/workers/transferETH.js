import { fundingQueue } from '../fundingQueue';
import signingService from '../../services/signingService';
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

export default async ({ name, data: { accountNumber } }) => {
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

  fundingQueue.add('checkStatus', { name, receipt }, options);
};
