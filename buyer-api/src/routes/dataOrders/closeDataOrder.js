import express from 'express';
// import { closeDataOrderFacade } from '../../facades';
import { closeOrdersOfBatch } from '../../facades';
import { asyncError } from '../../utils';

const router = express.Router();

/**
 * @swagger
 * /orders/{batchId}/close:
 *   post:
 *     description: |
 *       # Wibson's Protocol final step
 *       ## The Buyer closes the DataOrders within a Batch that were created on the first step.
 *     parameters:
 *       - in: path
 *         name: batchId
 *         type: string
 *         required: true
 *         description: The batchId which orders will be closed
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the orders are closed successfully
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
  // '/:orderAddress/close',
  '/:batchId/close',
  // validateAddress('orderAddress'),
  asyncError(async (req, res) => {
    const { batchId } = req.params;
    const {
      stores:
      { ordersCache, closedDataOrdersCache },
      queues:
      { closeDataOrder: queue },
    } = req.app.locals;

    const response = await closeOrdersOfBatch(batchId, ordersCache, closedDataOrdersCache, queue);

    if (response.success()) {
      res.json(response.result);
    } else {
      res.boom.badData('Operation failed', {
        errors: response.errors,
      });
    }
  }),
);

export default router;
