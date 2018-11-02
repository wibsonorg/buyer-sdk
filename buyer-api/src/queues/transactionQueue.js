import { createQueue } from './createQueue';
import { priority } from './priority';
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

    const receipt = await sendTransaction(
      web3,
      address,
      signFn,
      params,
      gasPrice || config.contracts.gasPrice.fast,
    );

    const waitOptions = { maxIterations: 30, interval: 30 };
    const transaction = await waitForExecution(web3, receipt, waitOptions);

    switch (transaction.status) {
      case 'success': {
        logger.info(`[tx][${name}] Transaction success ${receipt}`);
        break;
      }
      case 'failure': {
        logger.info(`[tx][${name}] Transaction failure ${receipt}`);
        break;
      }
      case 'pending': {
        logger.info(`[tx][${name}] Transaction pending ${receipt}. Proceeding to retry...`);
        throw new Error('Retry tx');
      }
      default: {
        logger.info(`[tx][${name}] Unknown transaction status`);
      }
    }

    return transaction;
  });

  return queue;
};

const transactionQueue = createTransactionQueue();
const enqueueTransaction = (account, signWith, params, gasPrice, options = {}) => {
  const {
    name, priority: p, attempts = 20, backoffType = 'linear',
  } = options;

  return transactionQueue.add('perform', {
    name: name || signWith.replace('sign', ''),
    account,
    signWith,
    params,
    gasPrice,
  }, {
    priority: p || priority.LOWEST,
    attempts,
    backoff: {
      type: backoffType,
    },
  });
};

export { transactionQueue, enqueueTransaction };
