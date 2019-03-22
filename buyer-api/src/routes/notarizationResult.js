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
 *           required:
 *             - orderId
 *             - notaryAddress
 *             - notarizationPercentage
 *             - notarizationFee
 *             - payDataHash
 *             - lock
 *             - sellers
 *           properties:
 *             orderId:
 *               type: number
 *               description: The unique identifier for the order.
 *             notaryAddress:
 *               type: string
 *               description: Notary's ethereum address.
 *             notarizationPercentage:
 *               type: number
 *               description: Percentage of orders that have been notarized.
 *             notarizationFee:
 *               type: number
 *               description: Flat one-time payment for the notarization services.
 *             payDataHash:
 *               type: string
 *               description: Seller ids array hash.
 *             lock:
 *               type: string
 *               description: The lock for the BatPay.Transfer.
 *             sellers:
 *               type: array
 *               description: List of sellers send to notary.
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
 */
router.post('/:notarizationRequestId', async (req, res) => {
  const { notarizationRequestId } = req.params;
  const notarizationResult = req.body;
  try {
    await receiveNotarizationResult(notarizationRequestId, notarizationResult);
    res.status(202).json({ message: 'OK' });
  } catch (error) {
    res.boom.notFound(error.message);
  }
});

export default router;
