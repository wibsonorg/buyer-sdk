import express from 'express';
import { asyncError } from '../../helpers';
import sign from '../../facades/sign/newOrderFacade';

const router = express.Router();

/**
 * @swagger
 * /sign/create-data-order:
 *   post:
 *     description: |
 *       ## Sign CreateDataOrder Transaction
 *       Receives DataExchange.createDataOrder parameters and
 *       responds with the serialized transaction ready to be sent to the
 *       network.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: nonce
 *         type: integer
 *         description: The number of transactions made by the sender
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
 *           $ref: "#/definitions/CreateDataOrderParameters"
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 *
 * definitions:
 *   CreateDataOrderParameters:
 *     type: object
 *     properties:
 *       audience:
 *         type: string
 *         description: Target audience of the order.
 *         required: true
 *       price:
 *         type: string
 *         description: Price that sellers will receive in exchange of their data.
 *         required: true
 *       requestedData:
 *         type: string
 *         description: Requested data type (Geolocation, Facebook, etc).
 *         required: true
 *       termsAndConditionsHash:
 *         type: string
 *         description: Hash of the Buyer's terms and conditions for the order.
 *         required: true
 *       buyerUrl:
 *         type: string
 *         description: |
 *           Public URL of the buyer where more information about the DataOrder
 *           can be obtained.
 *         required: true
 */
router.post('/create-data-order', asyncError(async (req, res) => {
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
