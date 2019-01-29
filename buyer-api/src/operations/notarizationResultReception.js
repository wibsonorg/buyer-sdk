
import { addTransactionJob } from '../queues/transactionQueue';

export function notarizationResultReception(notarizationRequest, notarizationResult) {
  notarizationResult.sellers = notarizationResult.sellers.filter((seller, index, self) =>
    index === self.findIndex((s) => (
      s.address === seller.address
    ))
  );

  // validate input notarizationRequest.sellers matches notarizationResult.sellers (address field)
  let filteredSellers = notarizationResult.sellers.filter(x => 
    notarizationRequest.sellers.map(y => y.address).includes(x.address));

  notarizationResult.sellers = filteredSellers
  return addTransactionJob('TranferNotarizationResult', notarizationResult);
}
