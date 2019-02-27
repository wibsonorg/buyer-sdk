import Router from 'express-promise-router';
import { asyncError } from '../utils';
import config from '../../config';
import addProcessDataResponseJob from '../queues/dataResponseQueue';
import { dataResponsesLastAdded } from '../utils/stores';

const router = Router();

/**
 * @swagger
 * /recurrent/batch-data-responses:
 *   post:
 *     description: Endpoint to launch the batches to notarize
 *     parameters:
 *       - name: passphrase
 *         description: validation of the request
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the batches are send
 *       422:
 *         description: When passphrase is incorrect
 */
router.post('/', asyncError(async (req, res) => {
  if (req.headers.authorization === `Bearer ${config.sendBatchPassphrase}`) {
    const batches = await dataResponsesLastAdded.list();
    batches.forEach((batch) => {
      addProcessDataResponseJob({ ...batch, accumulatorId: batch.id, type: 'sendNotarizationBatch' });
    });
    res.sendStatus(202);
  } else {
    res.sendStatus(401);
  }
}));

export default router;
