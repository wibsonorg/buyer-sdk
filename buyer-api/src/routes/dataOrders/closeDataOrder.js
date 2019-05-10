import Router from 'express-promise-router';
import fetchDataOrder from './middlewares/fetchDataOrder';
import { closeDataOrder } from '../../operations/closeDataOrder';

const router = Router();

/**
 * @swagger
 * /orders/{id}/close:
 *   post:
 *     description: |
 *       # Wibson's Protocol final step
 *       ## The Buyer closes the DataOrder it had created on the first step.
 *     parameters:
 *       - in: path
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
router.post('/:id/close', fetchDataOrder, async (req, res) => {
  if (req.dataOrder.status === 'created') {
    const response = await closeDataOrder(req.params.id, req.dataOrder);
    res.status(200).json(response.result);
  }
  res.status(422).json({ message: 'The order can not be closed' });
});

export default router;
