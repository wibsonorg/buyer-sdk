import express from 'express';
import asyncError from '../../helpers';

const router = express.Router();

/**
 * @swagger
 * /sign/new-order:
 *   post:
 *     description: Signs a DataExchange.newOrder transaction
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 */
router.post('/new-order', asyncError(async (req, res) => {
  const {
    nonce, // -> web3
    gasPrice, // -> XXX
    filters, // -> request
    dataRequest, // -> request
    price, // -> request
    initialBudgetForAudits, // -> request
    termsAndConditions, // -> Config
    buyerURL, // -> Config
  } = req.body;

  res.json({ status: 'OK' });
}));

export default router;
