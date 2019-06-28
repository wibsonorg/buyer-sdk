import Router from 'express-promise-router';
import { cache } from '../../utils';
import { dataOrders } from '../../utils/stores';
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
    const orders = await Promise.all((await dataOrders.list()).map(async o => ({
      ...o,
      buyerName: (await getBuyerInfo(o.buyerInfoId)).name,
    })));

    res.json(orders);
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
