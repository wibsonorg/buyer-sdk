import express from 'express';
import { asyncError } from '../../helpers';
import signNewOrderFacade from '../../facades/sign/newOrderFacade';

const router = express.Router();

/**
 * Checks that every field is present.
 *
 * @param {String} parameters.filters Hashed target audience.
 * @param {String} parameters.dataRequest Requested data type (Geolocation,
 *                 Facebook, etc).
 * @param {Integer} parameters.price Price per Data Response added.
 * @param {String} parameters.initialBudgetForAudits The initial budget set for
 *                 future audits.
 * @param {String} parameters.termsAndConditions Buyer's terms and conditions
 *                 for the order.
 * @param {String} parameters.buyerURL Public URL of the buyer where the data
 *                 must be sent.
 * @returns {array} Error messages
 */
const validateNewOrderParameters = ({
  filters,
  dataRequest,
  price,
  initialBudgetForAudits,
  termsAndConditions,
  buyerURL,
}) => {
  const fields = {
    filters,
    dataRequest,
    price: price && parseInt(price, 10),
    initialBudgetForAudits: initialBudgetForAudits &&
      parseInt(initialBudgetForAudits, 10),
    termsAndConditions,
    buyerURL,
  };

  return Object.entries(fields).reduce((accumulator, [field, value]) => {
    if (value === null || value === undefined) {
      return [...accumulator, `Field '${field}' is required`];
    }

    return accumulator;
  }, []);
};

/**
 * Checks that nonce and one of `newOrderParameters` or `newOrderPayload` are
 * present.
 *
 * @param {Integer} parameters.nonce The number of transactions made by the
 *                  sender including this one.
 * @param {Object} parameters.newOrderParameters Parameters to be used in the
 *                 transaction call.
 * @param {String} parameters.newOrderPayload Data payload to be used instead of
 *                 `newOrderParameters`
 * @returns {array} Error messages
 */
const validate = ({ nonce, newOrderParameters, newOrderPayload }) => {
  let errors = [];
  if (newOrderParameters) {
    errors = validateNewOrderParameters(newOrderParameters);
  } else if (newOrderPayload === null || newOrderPayload === undefined) {
    errors = [
      ...errors,
      'Field \'newOrderParameters\' or \'newOrderPayload\' must be provided',
    ];
  }

  if (nonce === null || nonce === undefined) {
    errors = [...errors, 'Field \'nonce\' is required'];
  }

  return errors;
};

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
 *         name: nonce
 *         type: integer
 *         description: |
 *           The number of transactions made by the sender including this one.
 *         required: true
 *       - in: body
 *         name: newOrderParameters
 *         description: Parameters to be used in the transaction call.
 *         schema:
 *           $ref: "#/definitions/NewOrderParameters"
 *       - in: body
 *         name: newOrderPayload
 *         type: string
 *         description: |
 *           Data payload to be used instead of `newOrderParameters`.
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
 *         type: integer
 *         description: Price per Data Response added.
 *         required: true
 *       initialBudgetForAudits:
 *         type: integer
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
  const { nonce, newOrderParameters, newOrderPayload } = req.body;
  const errors = validate({ nonce, newOrderParameters, newOrderPayload });

  if (errors.length > 0) {
    res.boom.badData('Validation failed', { validation: errors });
  } else {
    const response = signNewOrderFacade({
      nonce,
      newOrderParameters,
      newOrderPayload,
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
