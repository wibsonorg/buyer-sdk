import Router from 'express-promise-router';
import { cache, web3 } from '../../utils';
import { dataOrders, orderStats } from '../../utils/stores';
import { getBuyerInfo } from '../../services/buyerInfo';

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     description: Returns a list of all data orders created by the buyer in the Data Exchange.
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
  async (req, res) => {
    req.apicacheGroup = '/orders/*';

    const orders = await dataOrders.list();
    const result = orders.map(async (order) => {
      const buyerName = (await getBuyerInfo(order.buyerInfoId)).name;
      const { ethSpent, amountOfPayees, paymentsRegistered } = await orderStats.safeFetch(
        order.dxId,
        { ethSpent: 0, amountOfPayees: 0, paymentsRegistered: 0 },
      );
      return {
        ...order,
        sellersProcessed: amountOfPayees,
        wibSpent: (amountOfPayees * order.price),
        ethSpent: ethSpent ? Number(web3.utils.fromWei(`${ethSpent}`)).toFixed(3) : 0,
        paymentsRegistered,
        buyerName,
      };
    });
    res.json(await Promise.all(result));
  },
);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     description: Returns the data order information.
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: The uuid of the DataOrder to be fetched
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the order have been fetched correctly.
 *       500:
 *         description: When the fetch failed.
 */
router.get(
  '/:id',
  cache('1 minute'),
  async (req, res) => {
    req.apicacheGroup = '/orders/*';
    res.json(await dataOrders.fetch(req.params.id));
  },
);

export default router;
