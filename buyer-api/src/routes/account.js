import express from 'express';
import { web3, cache, asyncError, wibcoin, coin } from '../utils';
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
  const { root, children } = await signingService.getAccounts();

  const tokenBalancePromises = children.concat(root)
    .map(({ address }) => wibcoin.balanceOf.call(address));
  const tokenBalances = await Promise.all(tokenBalancePromises);
  const tokenBalance = tokenBalances.reduce((accum, item) => item.plus(accum), 0);

  const ethBalancePromises = children.concat(root)
    .map(({ address }) => web3.eth.getBalance(address));
  const ethBalances = await Promise.all(ethBalancePromises);
  const ethBalance = ethBalances.reduce((accum, item) => item.plus(accum), 0);

  const ether = web3.utils.fromWei(ethBalance.toString(), 'ether');
  const wib = coin.formatWib(coin.toWib(tokenBalance), { decimals: 2 });

  res.json({
    address: root.address,
    balance: Number(tokenBalance),
    ether: Number(ether),
    wib,
  });
}));

export default router;
