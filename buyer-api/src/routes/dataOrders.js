import express from 'express';
import { createDataOrder } from '../facades';
import { asyncError, cache } from '../utils';
import { getOrdersForBuyer } from '../facades/ordersFacade';
import signingService from '../services/signingService';

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     description: Returns a list of all data orders created by the buyer in the Data Exchange
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the list could be fetched correctly.
 *       500:
 *         description: When the fetch failed.
 */
router.get(
  '/',
  cache('30 seconds'),
  asyncError(async (req, res) => {
    const { offset, limit } = req.query;
    const { address } = await signingService.getAccount();

    const {
      stores: { buyerInfos, buyerInfoPerOrder },
      contracts: { dataExchange, DataOrderContract },
    } = req.app.locals;

    const orders = await getOrdersForBuyer(
      dataExchange,
      DataOrderContract,
      address,
      buyerInfos,
      buyerInfoPerOrder,
      Number(offset),
      Number(limit),
    );

    res.json({ orders });
  }),
);

/**
 * Checks that every field is present.
 *
 * @param {Object} parameters.filters Target audience.
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
const validate = ({
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
    price,
    initialBudgetForAudits,
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

/**
 * @swagger
 * /orders:
 *   post:
 *     description: |
 *       # STEP 1 from Wibson's Protocol
 *       ## Buyer creates a DataOrder
 *     parameters:
 *       - in: body
 *         name: dataOrder
 *         type: object
 *         required: true
 *         schema:
 *           $ref: "#/definitions/DataOrder"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app is OK
 *       422:
 *         description: When the app is OK
 *
 * definitions:
 *   DataOrder:
 *     type: object
 *     properties:
 *       filters:
 *         type: object
 *         required: true
 *         description: Target audience of the order
 *         example: { age: 20 }
 *       dataRequest:
 *         type: string
 *         required: true
 *         description: Requested data type (Geolocation, Facebook, etc)
 *         example: Geolocalization (last 30 days)
 *       price:
 *         type: integer
 *         required: true
 *         description: Price per added Data Response
 *         example: 20
 *       initialBudgetForAudits:
 *         type: integer
 *         required: true
 *         description: The initial budget set for future audits
 *         example: 10
 *       termsAndConditions:
 *         type: string
 *         required: true
 *         description: The initial budget set for future audits
 *         example: Terms and Conditions
 *       buyerURL:
 *         type: string
 *         required: true
 *         description: Public URL of the buyer where the data must be sent
 *         example: https://buyer.com/submit-your-data
 */
router.post('/', asyncError(async (req, res) => {
  const { dataOrder } = req.body;
  const errors = validate(dataOrder);

  if (errors.length > 0) {
    res.boom.badData('Validation failed', { validation: errors });
  } else {
    const response = await createDataOrder(dataOrder);

    res.json(response);
  }
}));

export default router;
