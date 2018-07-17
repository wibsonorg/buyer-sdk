import express from 'express';
import { asyncError, cache, validateAddress } from '../../utils';
import { getBuyerInfo, associateBuyerInfoToOrder } from '../../services/buyerInfo';

const router = express.Router();

/**
 * @swagger
 * /orders/:orderAddress/info:
 *   get:
 *     description: Returns extra information about the Data Order, such as buyer and project names,
 *                  category, etc.
 *     parameters:
 *       - name: orderAddress
 *         description: Ethereum address of the Data Order.
 *         required: true
 *         type: string
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
  validateAddress('orderAddress'),
  asyncError(async (req, res) => {
    const { orderAddress } = req.params;
    const {
      stores: { buyerInfos, buyerInfoPerOrder },
    } = req.app.locals;

    try {
      const buyerInfo = await getBuyerInfo(orderAddress, buyerInfoPerOrder, buyerInfos);
      res.json(buyerInfo);
    } catch (err) {
      res.status(404).send();
    }
  }),
);

/**
 * @swagger
 * /orders/:orderAddress/info:
 *   post:
 *     description: Associates a buyer info ID with a data order
 *     parameters:
 *       - name: orderAddress
 *         description: Ethereum address of the Data Order.
 *         required: true
 *         type: string
 *       - name: buyerInfoId
 *         description: The ID for the buyer info
 *         required: true
 *         type: string
 *         in: body
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
  validateAddress('orderAddress'),
  asyncError(async (req, res) => {
    const { orderAddress } = req.params;
    const { buyerInfoId } = req.body;
    const {
      stores: { buyerInfos, buyerInfoPerOrder },
    } = req.app.locals;

    try {
      await associateBuyerInfoToOrder(orderAddress, buyerInfoId, buyerInfoPerOrder, buyerInfos);
      res.json();
    } catch (err) {
      res.status(404).send();
    }
  }),
);

export default router;
