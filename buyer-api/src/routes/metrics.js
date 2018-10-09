import express from 'express';
import { getAllMetrics } from '../facades/metricsFacade';

const router = express.Router();

/**
 * @swagger
 * /metrics/account:
 *   get:
 *     description: Returns accounts' metrics
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When metrics are available
 */
router.get('/accounts', async (_req, res) => {
  res.json(await getAllMetrics());
});

export default router;
