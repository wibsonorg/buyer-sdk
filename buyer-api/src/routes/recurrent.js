import express from 'express';
import { asyncError } from '../utils';
import config from '../../config';

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
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When seller is registered and DataResponse queued
 *       422:
 *         description: When seller has already been registered
 */
router.post('/batch-data-responses', asyncError(async (req, res) => {
  const { passphrase } = req.body;
  if (passphrase === config.sendBatchPassphrase) {
    // TODO: launch batches to notarization
  } else {
    res.boom.badData('Incorrect passphrase');
  }
}));

export default router;
