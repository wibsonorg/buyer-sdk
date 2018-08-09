import express from 'express';
import {
  createDataOrderFacade,
  getOrdersForBuyer,
} from '../../facades';
import {
  getTransactionReceipt,
  extractEventArguments,
} from '../../facades/helpers';
import { asyncError, cache, web3 } from '../../utils';
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
    const { offset, limit } = req.query;
    const { address } = await signingService.getAccount();

    const {
      stores: { buyerInfos, buyerInfoPerOrder },
      contracts: { dataExchange, DataOrderContract },
    } = req.app.locals;

    const ordersResult = getOrdersForBuyer(
      dataExchange,
      DataOrderContract,
      address,
      buyerInfos,
      buyerInfoPerOrder,
      Number(offset),
      Number(limit),
    );

    const minimumBudget = dataExchange.minimumInitialBudgetForAudits();

    const [orders, minimumInitialBudgetForAudits] = await Promise.all([
      ordersResult,
      minimumBudget,
    ]);

    res.json({ orders, minimumInitialBudgetForAudits });
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
  notaries,
}) => {
  const fields = {
    filters,
    dataRequest,
    price,
    initialBudgetForAudits,
    termsAndConditions,
    buyerURL,
    notaries,
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
 *             orderAddress:
 *               type: string
 *               description: Address to be used in further requests
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
 *         example: 'Terms and Conditions'
 *       buyerURL:
 *         type: string
 *         required: true
 *         description: Public URL of the buyer where the data must be sent
 *         example: '{"api": "https://api.buyer.com", "storage": "https://storage.buyer.com"}'
 *       notaries:
 *         type: array
 *         required: true
 *         description: List of notaries' ethereum addresses
 */
router.post(
  '/',
  asyncError(async (req, res) => {
    const {
      contracts: { dataExchange },
      queues: { dataOrder: queue },
    } = req.app.locals;
    const { dataOrder } = req.body;
    const errors = validate(dataOrder);

    if (errors.length > 0) {
      res.boom.badData('Validation failed', { validation: errors });
    } else {
      const response = await createDataOrderFacade(
        dataOrder,
        dataExchange,
        queue,
      );

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

router.get(
  '/receipts/:receipt',
  asyncError(async (req, res) => {
    const {
      contracts: { dataExchange },
    } = req.app.locals;
    const { receipt } = req.params;

    if (!receipt) {
      res.boom.badData('Parameter \'receipt\' is mandatory');
    } else {
      try {
        const { logs } = await getTransactionReceipt(web3, receipt);
        const { orderAddr: orderAddress } = extractEventArguments(
          'NewOrder',
          logs,
          dataExchange,
        );
        res.json({ status: 'success', result: { orderAddress } });
      } catch (error) {
        if (error.pending) {
          res.json({ status: 'pending' });
        } else {
          res.json({ status: 'failed', error: error.message });
        }
      }
    }
  }),
);

export default router;
