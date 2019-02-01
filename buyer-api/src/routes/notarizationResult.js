import express from 'express';
import { asyncError, validateFields } from '../utils';
import { getNotarizationRequest } from '../facades';
import { notarizationResultReception } from '../operations/notarizationResultReception';


const router = express.Router();

/**
 * @swagger
 * /notarization-result/:notarizationRequestId:
 *   post:
 *     parameters:
 *       - name: notarizationRequestId
 *         description: Notarization request id
 *         required: true
 *         type: string
 *         in: uri
 *       - name: orderId
 *         description: The unique identifier for the order.
 *         required: true
 *         type: number
 *         in: body
 *       - name: notaryAddress
 *         description: Notary's ethereum address.
 *         required: true
 *         type: string
 *         in: body
 *       - name: notarizationPercentage
 *         description: Percentage of orders that have been notarized.
 *         required: true
 *         type: number
 *         in: body
 *       - name: notarizationFee
 *         description: Flat one-time payment for the notarization services.
 *         required: true
 *         type: number
 *         in: body
 *       - name: payDataHash
 *         description: .
 *         required: true
 *         type: string
 *         in: body
 *       - name: lock
 *         description: .
 *         required: true
 *         type: string
 *         in: body
 *       - name: sellers
 *         description: List of sellers send to notary.
 *         required: true
 *         type: array
 *         in: body
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
router.post(
  '/:notarizationRequestId',
  validateFields(),
  asyncError(async (req, res) => {
    const { notarizationRequestId } = req.params;
    const notarizationResult = req.body;

    const request = getNotarizationRequest(notarizationRequestId);
    if (!request) {
      res.boom.notFound('Notarization request not found');
    } else {
      notarizationResultReception(request, notarizationResult);
      res.status(202).json({ message: 'OK' });
    }
  }),
);

export default router;
