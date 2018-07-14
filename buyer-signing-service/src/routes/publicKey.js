import express from 'express';
import { buyer } from '../helpers';

const router = express.Router();

/**
 * @swagger
 * /public-key:
 *   get:
 *     description: Returns the public key
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app is OK
 */
router.get('/', async (_req, res) => {
  res.json({ publicKey: buyer.getPublicKey() });
});

export default router;
