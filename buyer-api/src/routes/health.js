import express from 'express';
import requestPromise from 'request-promise-native';
import config from '../../config';

const router = express.Router();

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
router.get('/deep', async (_req, res) => {
  try {
    await requestPromise.get(
      `${config.buyerSigningServiceUrl}/health`,
      { timeout: 1000 },
    );
    res.json({ status: 'OK' });
  } catch (error) {
    res.status(500).json({
      message: 'Signing Service not working as expected',
      error: error.message,
    });
  }
});

export default router;
