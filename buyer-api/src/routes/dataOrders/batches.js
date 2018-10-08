import express from 'express';
import { asyncError, cache } from '../../utils';
import { listBatchIds, getBatchInfo, listBatchPairs } from '../../services/batchInfo';

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
    // const batches = await listBatchIds();
    const batches = await listBatchPairs();

    res.json({
      batches,
    });
  }),
);

/**
 * @swagger
 * /batches/{batchId}:
 *   get:
 *     description: Returns orders that are in :batchId
 *     parameters:
 *       - name: batchId
 *         description: Leveldb batch Id
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the information could be fetched correctly.
 *       404:
 *         description: When the Data Order was not created by the buyer.
 *       500:
 *         description: When the fetch failed.
 */
router.get(
  '/batches/:batchId',
  cache('10 minutes'),
  asyncError(async (req, res) => {
    const { batchId } = req.params;
    try {
      const batchInfo = await getBatchInfo(batchId);
      res.json(batchInfo);
    } catch (err) {
      res.status(404).send();
    }
  }),
);

export default router;
