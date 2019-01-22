import config from '../../config';
import { priority, TxPriorities } from './priority';
import signingService from '../services/signingService';
import { createQueue } from './createQueue';
import { web3, logger, wibcoin } from '../utils';
import { sendTransaction, waitForExecution } from '../facades/helpers';

const { toBN } = web3.utils;
const minWib = toBN(config.balance.minWib);
const minWei = toBN(config.balance.minWei);
const notEnoughWib = minWib.gte.bind(minWib);
const notEnoughWei = minWei.gte.bind(minWei);

export const transactionQueue = createQueue('TransactionQueue');
export async function processTransaction({ id, data }) {
  const { name, params } = data;
  logger.info(`Tx[${id}] :: ${name} :: Started`);

  const { address } = await signingService.getAccount();
  const [wei, wib] = (await Promise.all([
    wibcoin.methods.balanceOf(address).call(),
    web3.eth.getBalance(address),
  ])).map(toBN);
  const insufficientWib = notEnoughWib(wib);
  const insufficientEth = notEnoughWei(wei);
  if (insufficientWib) {
    logger.error(`
  Buyer (${address}) does not have enough WIB.
  Current balance: ${wib} WIB
  Minimum balance: ${minWib} WIB
    `);
  }
  if (insufficientEth) {
    logger.error(`
  Buyer (${address}) does not have enough ETH.
  Current balance: ${wei} ETH
  Minimum balance: ${minWei} ETH
    `);
  }
  if (insufficientWib || insufficientEth) {
    await transactionQueue.pause();
    logger.info(`Tx[${id}] :: ${name} :: Transaction queue paused, re-enqueuing job.`);
    return transactionQueue.add(data);
  }

  const receipt = await sendTransaction(
    web3,
    address,
    signingService[`sign${name}`],
    params,
    config.contracts.gasPrice.fast,
  );
  const transaction = await waitForExecution(web3, receipt, config.transactionQueue);
  switch (transaction.status) {
    case 'success': {
      logger.info(`Tx[${id}] :: ${name} :: Success ${receipt}`);
      break;
    }
    case 'failure': {
      logger.error(`Tx[${id}] :: ${name} :: Failure ${receipt}`);
      break;
    }
    case 'pending': {
      logger.info(`Tx[${id}] :: ${name} :: Pending ${receipt} (will be retried)`);
      throw new Error('Retry tx');
    }
    default: {
      logger.error(`Tx[${id}] :: ${name} :: Unknown ${receipt} (will NOT be retried)`);
    }
  }
  return transaction;
}
transactionQueue.process(processTransaction);
transactionQueue.on('failed', (j) => {
  if (j.failedReason !== 'Retry tx') {
    logger.error(`Tx[${j.id}] :: ${j.data.name} :: Error thrown: ${j.failedReason} (will be retried)`);
  }
});

export const getTransactionJob = jobId => transactionQueue.getJob(jobId);
export const addTransactionJob = (name, params) =>
  transactionQueue.add({ name, params }, { priority: TxPriorities[name] || priority.LOWEST });
// DEPRECATED: Backward Compatibility
export const fetchTransactionJob = jobId => transactionQueue.getJob(jobId);
export const enqueueTransaction = (account, name, params) => addTransactionJob(name, params);
