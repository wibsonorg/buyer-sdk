import express from 'express';
import { asyncError } from '../../helpers';
import sign from '../../facades/sign/closeOrderFacade';

const router = express.Router();

/**
 * @swagger
 * /sign/close-data-order:
 *   post:
 *     description: |
 *       ## Sign CloseDataOrder Transaction
 *       Receives DataExchange.closeDataOrder parameters and responds with the
 *       serialized transaction ready to be sent to the network.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: nonce
 *         type: integer
 *         description: The number of transactions made by the sender.
 *         required: true
 *       - in: body
 *         name: gasPrice
 *         type: string
 *         description: Gas price
 *         required: true
 *       - in: body
 *         name: params
 *         description: Parameters to be used in the transaction call.
 *         schema:
 *           $ref: "#/definitions/CloseDataOrderParameters"
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 *
 * definitions:
 *   CloseDataOrderParameters:
 *     type: object
 *     properties:
 *       orderId:
 *         type: string
 *         description: The id of order to be closed
 *         required: true
 */
router.post('/close-data-order', asyncError(async (req, res) => {
  const { contracts: { dataExchange } } = req.app.locals;
  const { nonce, gasPrice, params } = req.body;
  const response = sign(nonce, gasPrice, params, dataExchange);

  if (response.success()) {
    res.json({ signedTransaction: response.result });
  } else {
    res.boom.badData('Operation failed', {
      errors: response.errors,
    });
  }
}));

export default router;
