import { createQueue } from './createQueue';
import { registerPayment } from '../operations/registerPayment';
import logger from '../utils/logger';

const process = async ({ id, data: { notarizationRequestId } }) => {
  logger.info(`NR[${id}] :: Process :: ${notarizationRequestId}`);
  return registerPayment(notarizationRequestId);
};

const queue = createQueue('RegisterPayments');
queue.process(process);
queue.on('failed', ({ id, failedReason }) => {
  logger.error(`NR[${id}] :: Process :: ${failedReason} (will be retried)`);
});

export const addRegisterPaymentJob = params => queue.add(params);
