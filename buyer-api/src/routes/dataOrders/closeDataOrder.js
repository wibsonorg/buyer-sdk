import express from 'express';
import { closeDataOrder } from '../../operations/closeDataOrder';
import { asyncError } from '../../utils';
import fetchDataOrder from './middlewares/fetchDataOrder';

const router = express.Router();

/**
 * @swagger
 * /orders/{id}/close:
 *   post:
 *     description: |
 *       # Wibson's Protocol final step
 *       ## The Buyer closes the DataOrder it had created on the first step.
 *     parameters:
 *       - in: params
 *         name: id
 *         type: string
 *         required: true
 *         description: The order id that will be closed
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the order is closed successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               description: Status of the transaction
 *             receipt:
 *               type: string
 *               description: Receipt of the transaction
 *       422:
 *         description: Problem on our side
 *       500:
 *         description: Problem on our side
 */
router.post(
  '/:id/close',
  fetchDataOrder,
  asyncError(async (req, res) => {
    if (req.dataOrder.status !== 'created') {
      res.status(422).json({ message: 'The order can not be closed' });
      return;
    }

    const response = await closeDataOrder(req.params.id, req.dataOrder);

    res.json(response.result);
  }),
);

export default router;
