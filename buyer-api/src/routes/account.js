import express from 'express';
import web3Utils from 'web3-utils';
import { web3, cache, asyncError, wibcoin } from '../utils';
import signingService from '../services/signingService';

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
router.get('/', cache('30 seconds'), asyncError(async (req, res) => {
  const accounts = await signingService.getAccounts();

  const tokenBalancePromises = accounts
    .map(({ address }) => wibcoin.balanceOf.call(address));
  const tokenBalances = await Promise.all(tokenBalancePromises);
  const balance = tokenBalances.reduce((accum, item) => item + accum, 0);

  const ethBalancePromises = accounts
    .map(({ address }) => web3.eth.getBalance(address));
  const ethBalances = await Promise.all(ethBalancePromises);
  const ethBalance = ethBalances.reduce((accum, item) => item.plus(accum), 0);

  const ether = web3Utils.fromWei(ethBalance.toString(), 'ether');

  res.json({
    address: accounts[0].address,
    balance: Number(balance),
    ether: Number(ether),
  });
}));

export default router;
