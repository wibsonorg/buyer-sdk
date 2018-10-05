import express from 'express';
import { asyncError, cache } from '../../utils';
import { listBatchIds } from '../../services/batchInfo';

const router = express.Router();

/**
 * @swagger
 * /batches:
 *   get:
 *     description: Returns a list of all batches associated with their
*      data orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the list could be fetched correctly.
 *       500:
 *         description: When the fetch failed.
 */
router.get(
  '/batches',
  cache('10 minutes'),
  asyncError(async (req, res) => {
    req.apicacheGroup = '/batches/*';
    const batches = await listBatchIds();

    res.json({
      batches,
    });
  }),
);

export default router;
