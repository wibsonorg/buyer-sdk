import express from 'express';
import { createDataOrderFacade, getOrdersForBuyer, getOrdersAmountForBuyer } from '../../facades';
import { asyncError, cache, dataExchange } from '../../utils';
import signingService from '../../services/signingService';

const router = express.Router();
/**
 * @swagger
 * /orders:
 *   get:
 *     description: Returns a list of all data orders created by the buyer in the Data Exchange
 *       along with the minimumInitialBudgetForAudits set for the market.
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
  cache('10 minutes'),
  asyncError(async (req, res) => {
    req.apicacheGroup = '/orders/*';
    const { offset, limit } = req.query;
    const { address } = await signingService.getAccount();

    const { stores: { ordersCache } } = req.app.locals;

    const ordersResult = getOrdersForBuyer(address, ordersCache, Number(offset), Number(limit));

    const minimumBudget = dataExchange.methods.minimumInitialBudgetForAudits().call();

    const [orders, minimumInitialBudgetForAudits] = await Promise.all([
      ordersResult,
      minimumBudget,
    ]);

    res.json({ orders, minimumInitialBudgetForAudits: Number(minimumInitialBudgetForAudits) });
  }),
);

/**
 * @swagger
 * /orders/total:
 *   get:
 *     description: Returns an object that shows the amount of open and closed data orders
 *       created by the buyer in the Data Exchange.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the orders have been fetched correctly.
 *       500:
 *         description: When the fetch failed.
 */
router.get(
  '/total',
  cache('10 minutes'),
  asyncError(async (req, res) => {
    req.apicacheGroup = '/orders/*';
    const { address } = await signingService.getAccount();

    const { stores: { ordersCache } } = req.app.locals;

    const orders = await getOrdersAmountForBuyer(address, ordersCache);

    const totalClosedOrders = orders.filter(order => order.isClosed).length;
    const totalOpenOrders = orders.filter(order => !order.isClosed).length;

    res.json({ totalClosedOrders, totalOpenOrders });
  }),
);

/**
 * Checks that every field is present.
 *
 * @param {Object} parameters.filters Target audience.
 * @param {String} parameters.dataRequest Requested data type (Geolocation,
 *                 Facebook, etc).
 * @param {String} parameters.price Price per Data Response added.
 * @param {String} parameters.initialBudgetForAudits The initial budget set for
 *                 future audits.
 * @param {String} parameters.buyerURL Public URL of the buyer where the data
 *                 must be sent.
 * @returns {array} Error messages
 */
const validate = ({
  filters,
  dataRequest,
  price,
  initialBudgetForAudits,
  buyerURL,
  notaries,
  buyerInfoId,
}) => {
  const fields = {
    filters,
    dataRequest,
    price,
    initialBudgetForAudits,
    buyerURL,
    notaries,
    buyerInfoId,
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
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               description: Status of the transaction
 *             receipt:
 *               type: string
 *               description: Receipt of the transaction
 *       422:
 *         description: When there is a problem with the input
 *       500:
 *         description: Problem on our side
 *
 * definitions:
 *   DataOrder:
 *     type: object
 *     properties:
 *       filters:
 *         type: object
 *         required: true
 *         description: Target audience of the order
 *         example: '{ "age": 20 }'
 *       dataRequest:
 *         type: string
 *         required: true
 *         description: Requested data type (Geolocation, Facebook, etc)
 *         example: '["geolocation"]'
 *       price:
 *         type: string
 *         required: true
 *         description: Price per added Data Response
 *         example: '20'
 *       initialBudgetForAudits:
 *         type: string
 *         required: true
 *         description: The initial budget set for future audits
 *         example: '10'
 *       buyerURL:
 *         type: string
 *         required: true
 *         description: Public URL of the buyer where the data must be sent
 *         example: '{"api": "https://api.buyer.com", "storage": "https://storage.buyer.com"}'
 *       notaries:
 *         type: array
 *         required: true
 *         description: List of notaries' ethereum addresses
 *       buyerInfoId:
 *         type: string
 *         required: true
 *         description: The ID for the buyer info
 */
router.post(
  '/',
  asyncError(async (req, res) => {
    const {
      queues: { dataOrder: queue },
    } = req.app.locals;
    const { dataOrder } = req.body;
    const errors = validate(dataOrder);

    if (errors.length > 0) {
      res.boom.badData('Validation failed', { validation: errors });
    } else {
      const response = await createDataOrderFacade(dataOrder, queue);

      if (response.success()) {
        res.json(response.result);
      } else {
        res.boom.badData('Operation failed', {
          errors: response.errors,
        });
      }
    }
  }),
);

export default router;
