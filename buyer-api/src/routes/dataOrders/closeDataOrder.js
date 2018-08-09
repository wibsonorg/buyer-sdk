import express from 'express';
import { closeDataOrderFacade } from '../../facades';
import { validateAddress, asyncError } from '../../utils';

const router = express.Router();

/**
 * @swagger
 * /orders/{orderAddress}/close:
 *   post:
 *     description: |
 *       # Wibson's Protocol final step
 *       ## The Buyer closes the DataOrder it had created on the first step.
 *     parameters:
 *       - in: params
 *         name: orderAddress
 *         type: string
 *         required: true
 *         description: The order address that will be closed
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
  '/:orderAddress/close',
  validateAddress('orderAddress'),
  asyncError(async (req, res) => {
    const { dataExchange } = req.app.locals.contracts;
    const { orderAddress } = req.params;

    const response = await closeDataOrderFacade(orderAddress, dataExchange);

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
