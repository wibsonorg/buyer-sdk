import { BigNumber } from 'bignumber.js';
import {
  getTransactionReceipt,
  sendTransaction,
  retryAfterError,
} from '../helpers';
import { balanceQueue } from '../../queues';
import signingService from '../../services/signingService';
import { web3, dataExchange, wibcoin, logger } from '../../utils';
import config from '../../../config';

const params = ({ minimumAllowance, multiplier }) => ({
  minimumAllowance: new BigNumber(minimumAllowance),
  multiplier: Number(multiplier),
});

const getAllowance = async myAddress =>
  wibcoin.methods.allowance(myAddress, dataExchange.options.address).call();

const checkAllowance = async () => {
  logger.info('Allowance Check :: Started');
  const { address } = await signingService.getAccount();
  const allowance = await getAllowance(address);
  const { minimumAllowance, multiplier } = params(config.allowance);

  if (minimumAllowance.isGreaterThan(allowance)) {
    const receipt = await sendTransaction(
      web3,
      address,
      signingService.signIncreaseApproval,
      {
        spender: dataExchange.options.address,
        addedValue: minimumAllowance.multipliedBy(multiplier),
      },
      config.contracts.gasPrice.fast,
    );

    balanceQueue.add('increaseApprovalSent', { receipt });
    logger.info('Allowance Check :: Approval increase requested');
  }
};

const onIncreaseApprovalSent = async (receipt) => {
  try {
    await getTransactionReceipt(web3, receipt);
  } catch (error) {
    if (!retryAfterError(error)) {
      logger.error('Could not increase approval (it will not be retried)' +
        ` | reason: ${error.message}`);
    } else {
      throw error;
    }
  }
};

export { checkAllowance, onIncreaseApprovalSent };
