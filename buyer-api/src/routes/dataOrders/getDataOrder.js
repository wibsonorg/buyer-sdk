import express from 'express';
import { getOrdersForBuyer, getOrdersAmountForBuyer } from '../../facades';
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
  cache('1 minute'),
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
  cache('1 minute'),
  asyncError(async (req, res) => {
    req.apicacheGroup = '/orders/*';
    const { address } = await signingService.getAccount();

    const orders = await getOrdersAmountForBuyer(address);

    res.json({
      totalClosedOrders: orders.closed,
      totalOpenOrders: orders.open,
    });
  }),
);

export default router;
