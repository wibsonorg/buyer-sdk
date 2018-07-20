import express from 'express';
import { asyncError } from '../../helpers';
import validateAddress from '../../middlewares/validateAddress';
import signCloseOrderFacade from '../../facades/sign/closeOrderFacade';

const router = express.Router();

const isPresent = obj => obj !== null && obj !== undefined;

/**
 * @swagger
 * /sign/close-order:
 *   post:
 *     description: |
 *       ## Sign CloseOrder Transaction
 *       Receives DataExchange.closeOrder parameters and responds with the
 *       serialized transaction ready to be sent to the network.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: nonce
 *         type: integer
 *         description: |
 *           The number of transactions made by the sender including this one.
 *         required: true
 *       - in: body
 *         name: orderAddr
 *         type: string
 *         required: true
 *         description: The address of order to be closed
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 */
router.post(
  '/close-order',
  validateAddress('orderAddr'),
  asyncError(async (req, res) => {
    const { nonce, orderAddr } = req.body;

    if (!isPresent(nonce)) {
      res.boom.badData('Validation failed', {
        validation: ['Field \'nonce\' is required'],
      });
    } else {
      const response = signCloseOrderFacade({ nonce, orderAddr });

      if (response.success()) {
        res.json({ signedTransaction: response.result });
      } else {
        res.boom.badData('Operation failed', {
          errors: response.errors,
        });
      }
    }
  }),
);

export default router;
