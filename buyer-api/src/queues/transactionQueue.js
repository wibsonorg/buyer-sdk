import { createQueue } from './createQueue';
import { web3, logger } from '../utils';
import { sendTransaction, waitForExecution } from '../facades/helpers';
import signingService from '../services/signingService';
import config from '../../config';

const createTransactionQueue = () => {
  const queue = createQueue('TransactionQueue');

  queue.process('perform', async (
    {
      data: {
        name,
        account,
        signWith,
        params,
        gasPrice,
      },
    },
  ) => {
    const { address } = account;
    const signFn = signingService[signWith];

    logger.debug(`[tx][${name}]`, {
      name,
      account,
      signWith,
      params,
      gasPrice,
    });

    const receipt = await sendTransaction(
      web3,
      address,
      signFn,
      params,
      gasPrice || config.contracts.gasPrice.fast,
    );

    const waitOptions = { maxIterations: 30, interval: 30 };
    const { status } = await waitForExecution(web3, receipt, waitOptions);

    switch (status) {
      case 'success': {
        logger.info(`[tx][${name}] Transaction success`);
        break;
      }
      case 'failure': {
        logger.info(`[tx][${name}] Transaction failure`);
        break;
      }
      case 'pending': {
        logger.info(`[tx][${name}] Transaction pending. Proceeding to retry...`);
        throw new Error('Retry tx');
      }
      default: {
        logger.info(`[tx][${name}] Unknown transaction status`);
        break;
      }
    }
  });

  return queue;
};

const transactionQueue = createTransactionQueue();

export { transactionQueue };
