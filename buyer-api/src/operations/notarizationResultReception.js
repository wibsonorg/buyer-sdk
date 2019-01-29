
import { addTransactionJob } from '../queues/transactionQueue';

export function notarizationResultReception(notarizationRequest, notarizationResult) {
  return addTransactionJob('TranferNotarizationResult', notarizationResult);
}
