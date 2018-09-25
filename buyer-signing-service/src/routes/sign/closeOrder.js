import express from 'express';
import { asyncError } from '../../helpers';
import signCloseOrderFacade from '../../facades/sign/closeOrderFacade';

const router = express.Router();

/**
 * @swagger
 * /sign/close-order:
 *   post:
 *     description: |
 *       ## Sign CloseOrder Transaction
 *       Receives DataExchange.closeOrder parameters and responds with the
 *       serialized transaction ready to be sent to the network.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: account
 *         type: integer
 *         description: The account index to use for the signature
 *         required: true
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
 *           $ref: "#/definitions/CloseOrderParameters"
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 *
 * definitions:
 *   CloseOrderParameters:
 *     type: object
 *     properties:
 *       orderAddr:
 *         type: string
 *         description: The address of order to be closed
 *         required: true
 */
router.post('/close-order', asyncError(async (req, res) => {
  const { contracts: { dataExchange } } = req.app.locals;
  const {
    account, nonce, gasPrice, params,
  } = req.body;
  const response = signCloseOrderFacade(account, nonce, gasPrice, params, dataExchange);

  if (response.success()) {
    res.json({ signedTransaction: response.result });
  } else {
    res.boom.badData('Operation failed', {
      errors: response.errors,
    });
  }
}));

export default router;
