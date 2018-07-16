import express from 'express';
import axios from 'axios';
import web3Utils from 'web3-utils';
import config from '../../config';
import { web3, cache, asyncError } from '../utils';

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
  const response = await axios.get(`${config.buyerSigningServiceUrl}/account`);
  const { address } = response.data.account;

  const { contracts: { wibcoin } } = req.app.locals;

  const [balance, ethBalance] = await Promise.all([
    wibcoin.balanceOf.call(address),
    web3.eth.getBalance(address),
  ]);
  const ether = web3Utils.fromWei(ethBalance.toString(), 'ether');

  res.json({
    address,
    balance: Number(balance),
    ether: Number(ether),
  });
}));

export default router;
