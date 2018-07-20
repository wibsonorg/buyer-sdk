import express from 'express';
import { asyncError, validate, isPresent } from '../../helpers';
import signAddDataResponseFacade from '../../facades/sign/addDataResponseFacade';

const router = express.Router();

const validateParameters = ({
  orderAddr,
  seller,
  notary,
  dataHash,
  signature,
}) => {
  const fields = {
    orderAddr,
    seller,
    notary,
    dataHash,
    signature,
  };

  return Object.entries(fields).reduce((accumulator, [field, value]) => {
    if (!isPresent(value)) {
      return [...accumulator, `Field '${field}' is required`];
    }

    return accumulator;
  }, []);
};

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
 *         name: nonce
 *         type: integer
 *         description: |
 *           The number of transactions made by the sender including this one.
 *         required: true
 *       - in: body
 *         name: params
 *         description: Parameters to be used in the transaction call.
 *         schema:
 *           $ref: "#/definitions/params"
 *       - in: body
 *         name: payload
 *         type: string
 *         description: |
 *           Data payload to be used instead of `params`.
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
  const { nonce, params, payload } = req.body;
  const errors = validate({ nonce, params, payload }, validateParameters);

  if (errors.length > 0) {
    res.boom.badData('Validation failed', { validation: errors });
  } else {
    const response = signAddDataResponseFacade(nonce, params, payload);

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
