import Router from 'express-promise-router';
import config from '../../config';
import { addProcessDataResponseJob } from '../queues/dataResponseQueue';
import { dataResponsesLastAdded } from '../utils/stores';
import { validateAuthorizationToken } from '../utils/routes';

const router = Router();

/**
 * @swagger
 * /batch-data-responses:
 *   post:
 *     description: Endpoint to launch the batches to notarize
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the batches are send
 *       422:
 *         description: When passphrase is incorrect
 */
router.post(
  '/',
  validateAuthorizationToken(config.sendBatchPassphrase),
  async (_req, res) => {
    const batches = await dataResponsesLastAdded.list();
    batches.forEach((batch) => addProcessDataResponseJob({
      ...batch,
      accumulatorId: batch.id,
      type: 'sendNotarizationBatch'
    }));
    res.sendStatus(202);
  },
);

export default router;
