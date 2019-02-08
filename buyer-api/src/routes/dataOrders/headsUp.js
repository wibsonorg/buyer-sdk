import express from 'express';
import { asyncError } from '../../utils';
import { saveSeller } from '../../services/sellerService';

const router = express.Router();

/**
 * @swagger
 * /orders/:orderID/heads-up:
 *   post:
 *     description: |
 *       Endpoint where the WAPI will make the POST request when the registration is finished.
 *     parameters:
 *       - name: orderId
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
 *         description: When validation results are registered successfully
 */
router.post(
  '/:orderId/heads-up',
  asyncError(async (req, res) => {
    const { sellerAddress, sellerId } = req.body;
    if (await saveSeller(sellerAddress, sellerId)) {
      res.status(202).json({ message: 'OK' });
    } else {
      res.boom.notFound('Seller has already been registered');
    }
  }),
);

export default router;
