import express from 'express';
import { asyncError } from '../../helpers';
import signNewOrderFacade from '../../facades/sign/newOrderFacade';

const router = express.Router();

/**
 * @TODO The schema is already defined in the swagger definition. Validation
 *       shoud be done using that definition.
 *
 * Checks that every field is present.
 *
 * @return {Array} Error messages
 */
const validate = ({
  nonce,
  gasPrice,
  filters,
  dataRequest,
  price,
  initialBudgetForAudits,
  termsAndConditions,
  buyerURL,
}) => {
  const fields = {
    nonce: nonce && parseInt(nonce, 10),
    gasPrice: gasPrice && parseInt(gasPrice, 10),
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
      return [...accumulator, `Field '${field}' is mandatory`];
    }

    return accumulator;
  }, []);
};


// * @param filters Target audience of the order.
// * @param dataRequest Requested data type (Geolocation, Facebook, etc).
// * @param price Price per added Data Response.
// * @param initialBudgetForAudits The initial budget set for future audits.
// * @param termsAndConditions Buyer's terms and conditions for the order.
// * @param buyerURL Public URL of the buyer where the data must be sent.

/**
 * @swagger
 * /sign/new-order:
 *   post:
 *     description: Signs a DataExchange.newOrder transaction
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: nonce
 *         type: integer
 *         description: |
 *           The number of transactions made by the sender prior to this one.
 *         required: true
 *       - in: body
 *         name: gasPrice
 *         type: integer
 *         description: Gas price determined by the sender in wei (IS THIS OK?).
 *         required: true
 *       - in: body
 *         name: transactionParameters
 *         description: Parameters to be used in the transaction call.
 *         required: true
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
 *         type: object
 *         description: Target audience of the order.
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
  const { nonce, gasPrice, transactionParameters } = req.body;
  const errors = validate({ nonce, gasPrice, ...transactionParameters });

  if (errors.length > 0) {
    res.boom.badData('Validation failed', { validation: errors });
  } else {
    const response = signNewOrderFacade({
      nonce,
      gasPrice,
      transactionParameters,
    });

    if (response.success()) {
      res.json({ signedTransaction: response.result() });
    } else {
      res.boom.badData('Operation validation failed', { validation: errors });
    }
  }
}));

export default router;
