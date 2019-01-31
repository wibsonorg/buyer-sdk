import express from 'express';
import { web3, cache, asyncError, wibcoin } from '../utils';
import { coin } from '../utils/wibson-lib';
import { getAccount } from '../services/signingService';

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
  const [balance, ethBalance] = await Promise.all([
    wibcoin.methods.balanceOf(address).call(),
    web3.eth.getBalance(address),
  ]);
  const ether = web3.utils.fromWei(ethBalance.toString(), 'ether');
  const wib = coin.toWib(balance, { decimals: 2 });
  res.json({
    address,
    balance: Number(balance),
    ether: Number(ether),
    wib,
  });
}));

export default router;
