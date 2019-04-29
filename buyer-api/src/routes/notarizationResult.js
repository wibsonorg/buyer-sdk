import Router from 'express-promise-router';
import { receiveNotarizationResult } from '../operations/receiveNotarizationResult';

const router = Router();

/**
 * @swagger
 * /notarization-result/{notarizationRequestId}:
 *   post:
 *     parameters:
 *       - in: path
 *         name: notarizationRequestId
 *         type: string
 *         required: true
 *         description: Notarization request id
 *       - in: body
 *         name: notarizationResult
 *         required: true
 *         schema:
 *           $ref: "#/definitions/NotarizationResult"
 *     produces:
 *       - application/json
 *     responses:
 *       202:
 *         description: When the result is validated.
 *       404:
 *         description: When could not find the notrarization request.
 *       422:
 *         description: When some field is missing or incorrect.
 *       500:
 *         description: When the fetch failed.
 *
 * definitions:
 *   NotarizationResult:
 *     type: object
 *     required:
 *       - orderId
 *       - notaryAddress
 *       - notarizationPercentage
 *       - notarizationFee
 *       - payDataHash
 *       - lockingKeyHash
 *       - sellers
 *     properties:
 *       orderId:
 *         type: number
 *         description: The unique identifier for the order.
 *       notaryAddress:
 *         type: string
 *         description: Notary's ethereum address.
 *       notarizationPercentage:
 *         type: number
 *         description: Percentage of orders that have been notarized.
 *       notarizationFee:
 *         type: number
 *         description: Flat one-time payment for the notarization services.
 *       payDataHash:
 *         type: string
 *         description: Seller ids array hash.
 *       lockingKeyHash:
 *         type: string
 *         description: The lockingKeyHash for the BatPay.registerPayment.
 *       sellers:
 *         type: array
 *         description: List of sellers send to notary.
 *         items:
 *           $ref: "#/definitions/NotarizationResultSeller"
 *   NotarizationResultSeller:
 *     type: object
 *     required:
 *       - sellerAddress
 *       - sellerId
 *       - result
 *       - decryptionKeyEncryptedWithMasterKey
 *     properties:
 *       sellerAddress:
 *         type: string
 *         description: Seller's ethereum address
 *       sellerId:
 *         type: number
 *         description: Seller ID in the DataExchange contract
 *       result:
 *         type: string
 *         description: The result of the notarization for the current seller
 *       decryptionKeyHash:
 *          type: string
 *          description: Hash of the key used to encrypt the data
 *       decryptionKeyEncryptedWithMasterKey:
 *         type: string
 *         description: Encrypted key
 */
router.post('/:notarizationRequestId', async (req, res) => {
  const { notarizationRequestId } = req.params;
  try {
    await receiveNotarizationResult(notarizationRequestId, req.body);
    res.status(202).json({ message: 'OK' });
  } catch (error) {
    res.boom.notFound(error.message);
  }
});

export default router;
