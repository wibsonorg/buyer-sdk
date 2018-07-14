import express from 'express';
import requestPromise from 'request-promise-native';
import config from '../../config';
import { web3, cache } from '../utils';

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
  } catch (err) {
    res.status(500).json({
      message: 'Signing Service not working as expected',
      error: err.message,
    });
  }
});

router.get('/:address/balance', async (req, res) => {
  try {
    const { address } = req.params;
    const response = await web3.eth.getBalance(address);
    const eth = response.toNumber();

    res.json({
      address,
      balance: eth,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get('/:address/tx-count', async (req, res) => {
  try {
    const { address } = req.params;
    const txCount = await web3.eth.getTransactionCount(address);

    res.json({
      address,
      txCount,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get('/redis', async (req, res) => {
  const { stores: { redis } } = req.app.locals;
  await redis.set('foo', 'bar');
  const bar = await redis.get('foo');

  res.json({ foo: bar });
});

router.get('/level', async (req, res) => {
  const { stores: { level } } = req.app.locals;
  await level.put('foz', 'baz');
  const baz = await level.get('foz');

  res.json({ foz: baz });
});

router.get('/cache', cache('5 minutes'), (req, res) => {
  res.json({ timestamp: Date.now() });
});

export default router;
