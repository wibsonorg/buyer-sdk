import express from 'express';
import { asyncError, cache, validateAddress } from '../utils';
import getBuyerInfo from '../services/buyerInfo';

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
