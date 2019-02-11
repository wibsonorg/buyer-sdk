import { addNotarizacionResultJob } from '../queues/tranferNotarizationResultQueue';
import { getNotarizationRequest } from '../facades';

/**
 * Seller inside Notarization Request
 * @typedef {Object} NotarizationRequestSellers
 * @property {NumberLike} id - numeric id for the seller
 * @property {uuid} address - has for the seller
 * @property {KeyHash} decryptionKeyHash - decryption key for seller data
 */

/**
 * Requeriment for notarization
 * @typedef {Object} NotarizationRequest
 * @property {NumberLike} orderId - tracking Id for the order
 * @property {String} callbackUrl - callback url for the notarization result
 * @property {NotarizationRequestSellers[]} sellers - list of sellers
 */

/**
 * Requeriment for notarization
 * @typedef {Object} NotarizationResult
 * @property {NumberLike} orderId - tracking Id for the order
 * @property {String} notaryAddress - address for the notary
 * @property {number} notarizationPercentage - notarized seller percentage
 * @property {number} notarizationFee - fee for the notarized data
 * @property {String} payDataHash - Hash for the payData
 * @property {String} lock - hash used to lock a batch of sellers to validate decryption key
 * @property {SellersInNotarizationRequest[]} sellers - list of sellers
 */

/**
 * @function receiveNotarizationResult
 * take notarization result, validate and enqueue for transfer
 * WARNING keep in mind that notarizationResult will be updated with the validated sellers
 * @param {string} notarizationRequestId original request sent for notarization
 * @param {NotarizationResult} notarizationResult results related with request done by notary
 */
export function receiveNotarizationResult(notarizationRequestId, notarizationResult) {
  // validate input
  // notarizationRequest.sellers matches notarizationResult.sellers (address field)
  // avoid duplicated addresses, avoid not requested addresses

  const notarizationRequest = getNotarizationRequest(notarizationRequestId);
  if (!notarizationRequest) {
    throw new Error('Notarization request not found');
  }

  return addNotarizacionResultJob({
    ...notarizationResult,
    sellers: notarizationResult.sellers.filter((seller, index, self) =>
      index === self.findIndex(s => (
        s.address === seller.address
      )) && notarizationRequest.sellers.map(y => y.address).includes(seller.address)),
  });
}
