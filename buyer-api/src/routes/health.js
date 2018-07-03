import express from 'express';
import requestPromise from 'request-promise-native';
import config from '../../config';

const router = express.Router();

router.get('/', async (_req, res) => {
  res.json({ status: 'OK' });
});

router.get('/deep', async (_req, res) => {
  try {
    await requestPromise.get(`${config.buyerSigningServiceUrl}/health`, { timeout: 1000 });
    res.json({ status: 'OK' });
  } catch (error) {
    res.status(500).json({ message: 'Signing Service not responding' });
  }
});

export default router;
