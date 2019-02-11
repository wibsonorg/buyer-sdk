import { addNotarizationResultJob } from '../queues/tranferNotarizationResultQueue';
import { notarizations } from '../utils/stores';

/**
 * @function receiveNotarizationResult
 * take notarization result, validate and enqueue for transfer
 * WARNING keep in mind that notarizationResult will be updated with the validated sellers
 * @param {string} notarizationRequestId original request sent for notarization
 * @param {NotarizationResult} notarizationResult results related with request done by notary
 */
export async function receiveNotarizationResult(notarizationRequestId, notarizationResult) {
  // validate input
  // notarizationRequest.sellers matches notarizationResult.sellers (address field)
  // avoid duplicated addresses, avoid not requested addresses

  const notarization = await notarizations.safeFetch(notarizationRequestId);
  if (!notarization) {
    throw new Error('Notarization request not found');
  }

  await notarizations.store(notarizationRequestId, {
    ...notarization,
    result: {
      ...notarizationResult,
      sellers: notarizationResult.sellers.filter((seller, index, self) =>
        index === self.findIndex(s => (
          s.address === seller.address
        )) && notarization.request.sellers.map(y => y.address).includes(seller.address)),
    },
    status: 'responded',
    respondedAt: new Date(),
  });

  return addNotarizationResultJob({ notarizationRequestId });
}
