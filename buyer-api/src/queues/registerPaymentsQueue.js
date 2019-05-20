import { createQueue } from './createQueue';
import { registerPayment } from '../operations/registerPayment';
import logger from '../utils/logger';

const queue = createQueue('RegisterPayments');

const pauseQueue = async (id) => {
  logger.info(`Tx[${id}] :: RegisterPayments queue paused, account's balance in BatPay is less than amount.`);
  queue.pause();
};

const process = async ({ id, data: { notarizationRequestId } }) => {
  logger.info(`NR[${id}] :: Process :: ${notarizationRequestId}`);
  return registerPayment(notarizationRequestId, pauseQueue, id);
};

queue.process(process);
queue.on('failed', ({ id, failedReason }) => {
  logger.error(`NR[${id}] :: Process :: ${failedReason} (will be retried)`);
});

export const addRegisterPaymentJob = params => queue.add(params);
