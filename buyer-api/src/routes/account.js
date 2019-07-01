import Router from 'express-promise-router';
import config from '../../config';
import { cache } from '../utils';
import { getAccount } from '../services/signingService';
import { getBalance } from '../blockchain/balance';

const router = Router();
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
router.get('/', cache('10 minutes'), async (req, res) => {
  const { address } = await getAccount();
  const { batPayId } = config;
  res.json(await getBalance(address, batPayId));
});

export default router;
