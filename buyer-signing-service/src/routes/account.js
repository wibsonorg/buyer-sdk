import express from 'express';
import { buyer } from '../helpers';

const router = express.Router();

/**
 * @swagger
 * /account:
 *   get:
 *     description: Returns account information
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When account info is available
 */
router.get('/', async (_req, res) => {
  res.json({
    address: buyer.getAddress(),
    publicKey: buyer.getPublicKey(),
    id: buyer.getId(),
  });
});

export default router;
