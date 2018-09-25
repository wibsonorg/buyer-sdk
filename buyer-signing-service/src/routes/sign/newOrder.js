import express from 'express';
import { asyncError } from '../../helpers';
import signNewOrderFacade from '../../facades/sign/newOrderFacade';

const router = express.Router();

/**
 * @swagger
 * /sign/new-order:
 *   post:
 *     description: |
 *       ## Sign NewOrder Transaction
 *       Receives DataExchange.newOrder parameters or a serialized payload and
 *       responds with the serialized transaction ready to be sent to the
 *       network.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: account
 *         type: integer
 *         description: The account index used to sign the transaction
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
 *           $ref: "#/definitions/NewOrderParameters"
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 *
 * definitions:
 *   NewOrderParameters:
 *     type: object
 *     properties:
 *       filters:
 *         type: string
 *         description: Hashed target audience.
 *         required: true
 *       dataRequest:
 *         type: string
 *         description: Requested data type (Geolocation, Facebook, etc).
 *         required: true
 *       price:
 *         type: string
 *         description: Price per Data Response added.
 *         required: true
 *       initialBudgetForAudits:
 *         type: string
 *         description: The initial budget set for future audits.
 *         required: true
 *       termsAndConditions:
 *         type: string
 *         description: Buyer's terms and conditions for the order.
 *         required: true
 *       buyerURL:
 *         type: string
 *         description: Public URL of the buyer where the data must be sent.
 *         required: true
 */
router.post('/new-order', asyncError(async (req, res) => {
  const { contracts: { dataExchange } } = req.app.locals;
  const {
    account, nonce, gasPrice, params,
  } = req.body;
  const response = signNewOrderFacade(account, nonce, gasPrice, params, dataExchange);

  if (response.success()) {
    res.json({ signedTransaction: response.result });
  } else {
    res.boom.badData('Operation failed', {
      errors: response.errors,
    });
  }
}));

export default router;
