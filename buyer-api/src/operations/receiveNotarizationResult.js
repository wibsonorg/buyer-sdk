import { addRegisterPaymentJob } from '../queues/registerPaymentsQueue';
import { notarizations, notarizationsPerLockingKeyHash } from '../utils/stores';

/**
 * @function receiveNotarizationResult
 * take notarization result, validate and enqueue for transfer
 * WARNING keep in mind that notarizationResult will be updated with the validated sellers
 * @param {string} notarizationRequestId original request sent for notarization
 * @param {import('../utils/stores').NotarizationResult} notarizationResult
 *    results related with request done by notary
 */
export async function receiveNotarizationResult(notarizationRequestId, notarizationResult) {
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
  await notarizationsPerLockingKeyHash.store(
    notarizationResult.lockingKeyHash,
    notarizationRequestId,
  );

  return addRegisterPaymentJob({ notarizationRequestId });
}
