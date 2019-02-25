import express from 'express';
import { cache, asyncError } from '../utils';
import { getAccount } from '../services/signingService';
import { getBalance } from '../blockchain/balance';

const router = express.Router();
/**
 * @swagger
 * /account:
 *   get:
 *     description: Return the balance in Wibcoins and Ether of the address.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the balance was fetched successfully.
 *       500:
 *         description: When the fetch failed.
 */
router.get('/', cache('10 minutes'), asyncError(async (req, res) => {
  const { address } = await getAccount();
  res.json(await getBalance(address));
}));

export default router;
