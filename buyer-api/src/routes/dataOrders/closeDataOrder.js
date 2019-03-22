import Router from 'express-promise-router';
import { closeDataOrderFacade } from '../../facades';
import { validateAddress } from '../../utils';

const router = Router();

/**
 * @swagger
 * /orders/{orderAddress}/end:
 *   post:
 *     description: |
 *       # Wibson's Protocol final step
 *       ## The Buyer closes the DataOrder it had created on the first step.
 *     parameters:
 *       - in: path
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
router.post('/:orderAddress/end', validateAddress('params.orderAddress'), async (req, res) => {
  const { orderAddress } = req.params;
  const response = await closeDataOrderFacade(orderAddress);
  if (response.success()) {
    res.json(response.result);
  } else {
    res.boom.badData('Operation failed', {
      errors: response.errors,
    });
  }
});

export default router;
