import { BigNumber } from 'bignumber.js';
import { enqueueTransaction, priority } from '../../queues';
import signingService from '../../services/signingService';
import { dataExchange, wibcoin, logger } from '../../utils';
import config from '../../../config';

const params = ({ minimumAllowance, multiplier }) => ({
  minimumAllowance: new BigNumber(minimumAllowance),
  multiplier: Number(multiplier),
});

const getAllowance = async myAddress =>
  wibcoin.methods.allowance(myAddress, dataExchange.options.address).call();

const checkAllowance = async () => {
  const account = await signingService.getAccount();
  const allowance = await getAllowance(account.address);
  const { minimumAllowance, multiplier } = params(config.allowance);

  if (minimumAllowance.isGreaterThan(allowance)) {
    enqueueTransaction(
      account,
      'IncreaseApproval',
      {
        spender: dataExchange.options.address,
        addedValue: minimumAllowance.multipliedBy(multiplier),
      },
      config.contracts.gasPrice.fast,
      { priority: priority.URGENT },
    );

    logger.info('Allowance Check :: Approval increase requested');
  }
};

export { checkAllowance };
