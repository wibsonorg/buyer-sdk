import express from 'express';
import { asyncError } from '../../utils';
import { saveSeller } from '../../operations/saveSeller';

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
 *       204:
 *         description: When validation results are registered successfully
 *       422:
 *         description: When seller has already been registered
 */
router.post('/:id/heads-up', asyncError(async (req, res) => {
  const { sellerAddress, sellerId } = req.body;
  if (await saveSeller(sellerAddress, sellerId)) {
    res.status(204).send();
  } else {
    res.boom.badData('Seller has already been registered');
  }
}));

export default router;
