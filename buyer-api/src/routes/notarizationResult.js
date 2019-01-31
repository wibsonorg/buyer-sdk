import express from 'express';
import { asyncError, validateFields } from '../utils';
import { getNotarizationRequest } from '../facades';


const router = express.Router();

/**
 * @swagger
 * /notarization-result/:notarizationRequestId:
 *   post:
 *     description: 
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
  asyncError(async (req, res) => {
    const { notarizationRequestId } = req.params;
    const notarizationResult = req.body;

    let validation = validateFields(notarizationResult)
    if( validation.length > 0 ){
      res.status(422).json({
        "statusCode": 422,
        "statusText": "Unprocessable Entity",
        "message": "Parameters missing",
        "errors": validation
      });
    } else {
      let request = getNotarizationRequest(notarizationRequestId)
      if(!request) {
        res.status(404).json({
          "statusCode": 404,
          "message": "Could not find a request whith the id provided"
        });
      }
      else {
        console.log("final")
        res.status(202).json({ message: "OK" });
      }
    }
  }),
);

export default router;
