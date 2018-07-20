import express from 'express';
import { asyncError, validate } from '../../helpers';
import addNotaryToOrderFacade from '../../facades/sign/addNotaryToOrderFacade';

const router = express.Router();

/**
 * @swagger
 * /sign/add-notary-to-order:
 *   post:
 *     description: |
 *       ## Sign AddNotaryToOrder Transaction
 *       Receives DataExchange.addNotaryToOrder parameters and
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
 *         name: addNotaryToOrderParameters
 *         description: Parameters to be used in the transaction call.
 *         schema:
 *           $ref: "#/definitions/AddNotaryToOrderParameters"
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *         schema:
 *           type: object
 *           properties:
 *             signedTransaction:
 *               type: string
 *               description: Serialized transaction
 *       422:
 *         description: When the signing performs successfully
 *       500:
 *         description: Problem with the signing process
 *
 * definitions:
 *   AddNotaryToOrderParameters:
 *     type: object
 *     properties:
 *       orderAddr:
 *         type: string
 *         description: Order Address to accept notarize.
 *         required: true
 *       notary:
 *         type: string
 *         description: Notary address
 *         required: true
 *       responsesPercentage:
 *         type: integer
 *         required: true
 *         description: |
 *           Percentage of `DataResponses` to audit per DataOrder.
 *           Value must be between 0 and 100.
 *         example: 30
 *       notarizationFee:
 *         type: integer
 *         required: true
 *         description: Fee to be charged per validation done.
 *         example: 10
 *       notarizationTermsOfService:
 *         type: string
 *         required: true
 *         description: Notary's terms and conditions for the order.
 *         example: Terms and Conditions for DataOrder
 *       notarySignature:
 *         type: string
 *         required: true
 *         description: Notary's signature over the other arguments.
 *         example: 0x3164c60ef3e26cb8c1d97effe36777ad8f45341c8b400fda5e5c5f57a
 */
router.post('/add-notary-to-order', asyncError(async (req, res) => {
  const { nonce, addNotaryToOrderParameters } = req.body;
  const errors = validate({ nonce, addNotaryToOrderParameters });

  if (errors.length > 0) {
    res.boom.badData('Validation failed', { validation: errors });
  } else {
    const response = addNotaryToOrderFacade({
      nonce,
      addNotaryToOrderParameters,
    });

    if (response.success()) {
      res.json({ signedTransaction: response.result });
    } else {
      res.boom.badData('Operation failed', {
        errors: response.errors,
      });
    }
  }
}));

export default router;
