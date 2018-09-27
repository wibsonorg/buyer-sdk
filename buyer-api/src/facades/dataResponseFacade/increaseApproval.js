import { BigNumber } from 'bignumber.js';
import {
  getTransactionReceipt,
  sendTransaction,
  retryAfterError,
} from '../helpers';
import signingService from '../../services/signingService';
import { web3, dataExchange, wibcoin, logger } from '../../utils';
import config from '../../../config';

const params = ({ minimumAllowance, multiplier }) => ({
  minimumAllowance: new BigNumber(minimumAllowance),
  multiplier: Number(multiplier),
});

const getAllowance = myAddress =>
  wibcoin.allowance(myAddress, dataExchange.address);

const checkAllowance = async ({ balance }) => {
  const { address } = await signingService.getAccount();
  const allowance = await getAllowance(address);
  const { minimumAllowance, multiplier } = params(config.buyData);

  if (minimumAllowance.isGreaterThan(allowance)) {
    const receipt = await sendTransaction(
      web3,
      address,
      signingService.signIncreaseApproval,
      {
        spender: dataExchange.address,
        addedValue: minimumAllowance.multipliedBy(multiplier),
      },
      config.contracts.gasPrice.fast,
    );

    balance.add('increaseApprovalSent', { receipt });
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
