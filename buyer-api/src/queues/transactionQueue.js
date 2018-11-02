import { createQueue } from './createQueue';
import { web3, logger } from '../utils';
import { sendTransaction, waitForExecution } from '../facades/helpers';
import signingService from '../services/signingService';
import config from '../../config';

const createTransactionQueue = () => {
  const queue = createQueue('TransactionQueue');

  queue.process('perform', async (
    {
      id,
      data: {
        name,
        account,
        signWith,
        params,
        gasPrice,
      },
    },
  ) => {
    logger.info(`Tx[${id}] :: ${name} :: Started`);

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
        logger.info(`Tx[${id}] :: ${name} :: Success ${receipt}`);
        break;
      }
      case 'failure': {
        logger.info(`Tx[${id}] :: ${name} :: Failure ${receipt}`);
        break;
      }
      case 'pending': {
        logger.info(`Tx[${id}] :: ${name} :: Pending ${receipt} (will be retried)`);
        throw new Error('Retry tx');
      }
      default: {
        logger.info(`Tx[${id}] :: ${name} :: Unknown ${receipt} (will NOT be retried)`);
      }
    }

    return transaction;
  });

  return queue;
};

const transactionQueue = createTransactionQueue();
const enqueueTransaction = (account, signWith, params, gasPrice, options = {}) => {
  const {
    name, priority = 1000, attempts = 20, backoffType = 'linear',
  } = options;

  return transactionQueue.add('perform', {
    name: name || signWith.replace('sign', ''),
    account,
    signWith,
    params,
    gasPrice,
  }, {
    priority,
    attempts,
    backoff: {
      type: backoffType,
    },
  });
};

export { transactionQueue, enqueueTransaction };
