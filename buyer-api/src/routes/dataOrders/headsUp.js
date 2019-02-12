import express from 'express';
import { asyncError } from '../../utils';
import fetchDataOrder from './middlewares/fetchDataOrder';
import { saveSeller } from '../../operations/saveSeller';
import { enqueueDataResponse } from '../../operations/enqueueDataResponse';

const router = express.Router();

/**
 * @swagger
 * /orders/{id}/heads-up:
 *   post:
 *     description: |
 *       Endpoint where the sellers registrerer will send the information regarding a new seller.
 *     parameters:
 *       - name: id
 *         description: Order ID in the DataExchange contract
 *         required: true
 *         type: number
 *         in: uri
 *       - name: sellerAddress
 *         description: Seller's ethereum address.
 *         required: true
 *         type: string
 *         in: body
 *       - name: sellerId
 *         description: Seller's unique ID.
 *         required: true
 *         type: number
 *         in: body
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When seller is registered and DataResponse queued
 *       422:
 *         description: When seller has already been registered
 */
router.post('/:id/heads-up', fetchDataOrder, asyncError(async (req, res) => {
  const { sellerAddress, sellerId } = req.body;
  if (await saveSeller(sellerAddress, sellerId)) {
    const { error, ...result } = await enqueueDataResponse(req.params.id, sellerAddress, sellerId);

    if (error) {
      res.boom.badData('Operation failed', { error });
    } else {
      res.json(result);
    }
  } else {
    res.boom.badData('Seller has already been registered');
  }
}));

export default router;
