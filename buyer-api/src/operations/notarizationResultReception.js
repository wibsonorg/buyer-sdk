
import { addTransactionJob } from '../queues/transactionQueue';

export function notarizationResultReception(notarizationRequest, notarizationResult) {
  // validate input 
  // notarizationRequest.sellers matches notarizationResult.sellers (address field)
  // avoid duplicated addresses, avoid not requested addresses
  notarizationResult.sellers = notarizationResult.sellers.filter((seller, index, self) =>
    index === self.findIndex((s) => (
      s.address === seller.address
    )) && notarizationRequest.sellers.map(y => y.address).includes(seller.address)
  );

  return addTransactionJob('TranferNotarizationResult', notarizationResult);
}
