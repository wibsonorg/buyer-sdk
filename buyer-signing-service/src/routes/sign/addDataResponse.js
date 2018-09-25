import express from 'express';
import { asyncError } from '../../helpers';
import signAddDataResponseFacade from '../../facades/sign/addDataResponseFacade';

const router = express.Router();

/**
 * @swagger
 * /sign/add-data-response:
 *   post:
 *     description: |
 *       ## Sign addDataResponseToOrder Transaction
 *       Receives DataExchange.addDataResponseToOrder parameters or a serialized payload and
 *       responds with the serialized transaction ready to be sent to the
 *       network.
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
 *           $ref: "#/definitions/params"
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
 *       notaryAccount:
 *         type: string
 *         description: Address of the notary.
 *         required: true
 *       dataHash:
 *         type: string
 *         description: SHA256 of the data that will be sent.
 *         required: true
 *       signature:
 *         type: string
 *         description: Data Response signature.
 *         required: true
 */
router.post('/add-data-response', asyncError(async (req, res) => {
  const { contracts: { dataExchange } } = req.app.locals;
  const {
    account, nonce, gasPrice, params,
  } = req.body;
  const response = signAddDataResponseFacade(
    account,
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
