import { createQueue } from './createQueue';
import { priority, TxPriorities } from './priority';
import { web3, logger } from '../utils';
import { hasEnoughBalance } from '../facades/balanceFacade';
import { sendTransaction, waitForExecution } from '../facades/helpers';
import signingService from '../services/signingService';
import config from '../../config';

const enqueueJob = (data, queue, options = {}) => {
  const {
    account, name, params, gasPrice,
  } = data;
  const {
    priority: p, attempts = 20, backoffType = 'linear',
  } = options;

  return queue.add('perform', {
    name,
    account,
    signWith: `sign${name}`,
    params,
    gasPrice,
  }, {
    priority: p || TxPriorities[name] || priority.LOWEST,
    attempts,
    backoff: {
      type: backoffType,
    },
  });
};

const reenqueueJob = async (data, queue, options) => {
  const newJob = await enqueueJob(data, queue, options);
  return { newJobId: newJob.id, data: newJob.data };
};

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

    const enoughBalance = await hasEnoughBalance(address);
    if (!enoughBalance) {
      // To pause the queue, bulljs renames its waiting list to `paused`. This
      // operation is atomic and is done in:
      //   https://github.com/OptimalBits/bull/blob/v3.4.4/lib/commands/pause-4.lua
      //
      // To enqueue a new Job, bulljs uses the following lua script:
      //   https://github.com/OptimalBits/bull/blob/v3.4.4/lib/commands/addJob-6.lua
      // It checks if the queue is paused. If so, it will add the new job to the
      // paused list. If not, the job is added to the waiting list.
      await queue.pause();
      logger.info(`Tx[${id}] :: ${name} :: Transaction queue paused, re-enqueuing job.`);
      return reenqueueJob({
        account, name, params, gasPrice,
      }, queue);
    }

    const receipt = await sendTransaction(
      web3,
      address,
      signFn,
      params,
      gasPrice || config.contracts.gasPrice.fast,
    );

    const transaction = await waitForExecution(web3, receipt, config.transactionQueue);

    switch (transaction.status) {
      case 'success': {
        logger.info(`Tx[${id}] :: ${name} :: Success ${receipt}`);
        break;
      }
      case 'failure': {
        logger.notice(`Tx[${id}] :: ${name} :: Failure ${receipt}`);
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

  queue.on('failed', ({
    id, failedReason, data: { name },
  }) => {
    if (failedReason !== 'Retry tx') {
      logger.error(`Tx[${id}] :: ${name} :: Error thrown: ${failedReason} (will be retried)`);
    }
  });

  return queue;
};

const transactionQueue = createTransactionQueue();
const fetchTransactionJob = async jobId => transactionQueue.getJob(jobId);
const enqueueTransaction = (account, name, params, gasPrice, opts = {}) =>
  enqueueJob({
    account, name, params, gasPrice,
  }, transactionQueue, opts);

export { transactionQueue, enqueueTransaction, fetchTransactionJob };
