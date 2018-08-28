import express from 'express';
import { asyncError } from '../../helpers';
import signCloseDataResponseFacade from '../../facades/sign/closeDataResponseFacade';

const router = express.Router();

/**
 * @swagger
 * /sign/close-data-response:
 *   post:
 *     description: |
 *       ## Sign closeDataResponse Transaction
 *       Receives DataExchange.closeDataResponse parameters or a serialized payload and
 *       responds with the serialized transaction ready to be sent to the
 *       network.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: nonce
 *         type: integer
 *         description: |
 *           The number of transactions made by the sender including this one.
 *         required: true
 *       - in: body
 *         name: gasPrice
 *         type: string
 *         description: The number of transactions made by the sender.
 *         required: true
 *       - in: body
 *         name: params
 *         description: Parameters to be used in the transaction call.
 *         schema:
 *           $ref: "#/definitions/AddDataResponseParameters"
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 *
 * definitions:
 *   params:
 *     type: object
 *     properties:
 *       orderAddr:
 *         type: string
 *         description: Address of the DataOrder.
 *         required: true
 *       seller:
 *         type: string
 *         description: Address of the seller.
 *         required: true
 *       wasAudited:
 *         type: boolean
 *         description: If the data response was audited or not.
 *         required: true
 *       isDataValid:
 *         type: boolean
 *         description: If the data audited is valid.
 *         required: true
 *       notarySignature:
 *         type: string
 *         description: Notary signature.
 *         required: true
 */
router.post('/close-data-response', asyncError(async (req, res) => {
  const { contracts: { dataExchange } } = req.app.locals;
  const { nonce, gasPrice, params } = req.body;
  const response = signCloseDataResponseFacade(
    nonce,
    gasPrice,
    params,
    dataExchange,
  );

  if (response.success()) {
    res.json({ signedTransaction: response.result });
  } else {
    res.boom.badData('Operation failed', {
      errors: response.errors,
    });
  }
}));

export default router;
