import Router from 'express-promise-router';
import fetchDataOrder from './middlewares/fetchDataOrder';
import { saveSeller } from '../../operations/saveSeller';
import { enqueueDataResponse } from '../../operations/enqueueDataResponse';

const router = Router();

/**
 * @swagger
 * /orders/{id}/heads-up:
 *   post:
 *     description: |
 *       Endpoint where the sellers registrerer will send the information regarding a new seller.
 *     parameters:
 *       - in: path
 *         name: id
 *         type: number
 *         required: true
 *         description: Order ID in the DataExchange contract
 *       - in: body
 *         name: seller
 *         required: true
 *         schema:
 *            required:
 *              - sellerId
 *              - sellerAddress
 *            properties:
 *              sellerId:
 *                type: number
 *                description: Seller's unique ID.
 *              sellerAddress:
 *                type: string
 *                description: Seller's ethereum address.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When seller is registered and DataResponse queued
 *       422:
 *         description: When seller has already been registered
 */
router.post('/:id/heads-up', fetchDataOrder, async (req, res) => {
  const { sellerAddress, sellerId } = req.body;
  if (await saveSeller(sellerAddress, sellerId)) {
    const {
      error,
      ...result
    } = await enqueueDataResponse(req.dataOrder.dxId, sellerAddress, sellerId);

    if (error) {
      res.boom.badData('Operation failed', { error });
    } else {
      res.json(result);
    }
  } else {
    res.boom.badData('Seller has already been registered');
  }
});

export default router;
