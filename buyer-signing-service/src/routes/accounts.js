import express from 'express';
import { accounts, asyncError } from '../helpers';

const router = express.Router();

/**
 * @swagger
 * /accounts:
 *   get:
 *     description: Returns the information regarding all the accounts
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When accounts information is available
 */
router.get('/', asyncError(async (_req, res) => {
  res.json({
    root: accounts.getRootAccount(),
    children: accounts.getAccounts(),
  });
}));

/**
 * @swagger
 * /accounts/root:
 *   get:
 *     description: Returns root account information
 *     parameters:
 *       - in: path
 *         name: account
 *         type: integer
 *         description: The account index
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When account info is available
 */
router.get('/root', asyncError(async (_req, res) => {
  res.json(accounts.getRootAccount());
}));

/**
 * @swagger
 * /accounts/{account}:
 *   get:
 *     description: Returns account information
 *     parameters:
 *       - in: path
 *         name: account
 *         type: integer
 *         description: The account index
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When account info is available
 */
router.get('/:account', asyncError(async (req, res) => {
  const account = Number(req.params.account);
  if (Number.isInteger(account)) {
    res.json(accounts.getAccount(account));
  } else {
    res.boom.notFound();
  }
}));

export default router;
