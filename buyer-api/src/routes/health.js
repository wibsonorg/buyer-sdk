import Router from 'express-promise-router';
import { getHealth } from '../services/signingService';
import { cache } from '../utils';

const NS_PER_SEC = 1e9;

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     description: |
 *       The main use case of this endpoint is to check if the app is
 *       responding.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app is OK
 */
router.get('/', async (_req, res) => {
  res.json({ status: 'OK' });
});

router.get('/cache', cache('1 minute'), (req, res) => {
  res.json({ timestamp: Date.now(), ttl: '1 minute' });
});

/**
 * @swagger
 * /health/deep:
 *   get:
 *     description: Check if the app and sub-systems are working.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app and sub-systems are OK
 *       500:
 *         description: When the app or sub-systems are not responding
 */
router.get('/ss', async (_req, res) => {
  const time = process.hrtime();
  const response = await getHealth();
  const diff = process.hrtime(time);

  res.json({
    ...response,
    ns: `Took ${(diff[0] * NS_PER_SEC) + diff[1]} nanoseconds`,
  });
});

export default router;
