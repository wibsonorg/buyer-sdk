import Router from 'express-promise-router';
import { cache, validateAddress, checkAuthorization } from '../../utils';
import {
  getOrderInfo,
  associateBuyerInfoToOrder,
} from '../../services/buyerInfo';

const router = Router();

/**
 * @swagger
 * /orders/{orderAddress}/info:
 *   get:
 *     description: Returns extra information about the Data Order, such as buyer and project names,
 *                  category, etc.
 *     parameters:
 *       - in: path
 *         name: orderAddress
 *         type: string
 *         required: true
 *         description: Ethereum address of the Data Order.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the information could be fetched correctly.
 *       404:
 *         description: When the Data Order was not created by the buyer.
 *       500:
 *         description: When the fetch failed.
 */
router.get(
  '/:orderAddress/info',
  cache('30 days'),
  validateAddress('params.orderAddress'),
  async (req, res) => {
    const { orderAddress } = req.params;
    try {
      const buyerInfo = await getOrderInfo(orderAddress);
      res.json(buyerInfo);
    } catch (err) {
      res.boom.notFound(err.message);
    }
  },
);

/**
 * @swagger
 * /orders/{orderAddress}/info:
 *   post:
 *     description: Associates a buyer info ID with a data order
 *     parameters:
 *       - in: path
 *         name: orderAddress
 *         type: string
 *         required: true
 *         description: Ethereum address of the Data Order.
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           required:
 *             - buyerInfoId
 *           properties:
 *             buyerInfoId:
 *              type: string
 *              description: The ID for the buyer info.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the information could be associated correctly.
 *       404:
 *         description: When the Data Order was not created by the buyer or the ID does not exist
 *       500:
 *         description: When the association failed.
 */
router.post(
  '/:orderAddress/info',
  checkAuthorization,
  validateAddress('params.orderAddress'),
  async (req, res) => {
    const { orderAddress } = req.params;
    const { buyerInfoId } = req.body;
    try {
      await associateBuyerInfoToOrder(orderAddress, buyerInfoId);
      res.json({});
    } catch (err) {
      res.boom.notFound(err.message);
    }
  },
);

export default router;
