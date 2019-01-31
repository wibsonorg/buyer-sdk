import { addTransactionJob } from '../queues/transactionQueue';

/**
 * Seller inside Notarization Request
 * @typedef {Object} SellersInNotarizationRequest
 * @property {NumberLike} id - numeric id for the seller
 * @property {uuid} address - has for the seller
 * @property {KeyHash} decryptionKeyHash - decryption key for seller data
 */

/**
 * Requeriment for notarization
 * @typedef {Object} NotarizationRequest
 * @property {NumberLike} orderId - tracking Id for the order
 * @property {String} callbackUrl - callback url for the notarization result
 * @property {SellersInNotarizationRequest[]} sellers - list of sellers
 */

/**
 * take notarization result, validate and enqueue for transfer
 * WARNING keep in mind that notarizationResult will be updated with the validated sellers
 * @param {NotarizationRequest} notarizationRequest original request sent for notarization
 * @param {NotarizationResult} notarizationResult results related with request done by notary
 */
export function notarizationResultReception(notarizationRequest, notarizationResult) {
  // validate input
  // notarizationRequest.sellers matches notarizationResult.sellers (address field)
  // avoid duplicated addresses, avoid not requested addresses
  const sellers = notarizationResult.sellers.filter((seller, index, self) =>
    index === self.findIndex(s => (
      s.address === seller.address
    )) && notarizationRequest.sellers.map(y => y.address).includes(seller.address));

  const result = notarizationRequest;
  result.seller = sellers;
  return addTransactionJob('TranferNotarizationResult', result);
}
