import express from 'express';

const router = express.Router();

router.get('/', async (_req, res) => {
  res.json({ status: 'OK' });
});

export default router;
