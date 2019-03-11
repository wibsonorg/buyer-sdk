import express from 'express';
import {
  asyncError,
  buildMethodSigner as builder,
  buyer,
} from '../../helpers';

const router = express.Router();

/**
 * @swagger
 * /sign/bat-pay/deposit:
 *   post:
 *     description: |
 *       ## Sign BatPay.deposit Transaction
 *       Receives BatPay.deposit parameters and responds with the serialized
 *       transaction ready to be sent to the network.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: nonce
 *         type: integer
 *         description: The number of transactions made by the sender
 *         required: true
 *       - in: body
 *         name: gasPrice
 *         type: string
 *         description: Gas price
 *         required: true
 *       - in: body
 *         name: params
 *         description: Parameters to be used in the transaction call.
 *         schema:
 *           $ref: "#/definitions/BatPayDepositParameters"
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 *
 * definitions:
 *   BatPayDepositParameters:
 *     type: object
 *     properties:
 *       amount:
 *         type: number
 *         description: Amount of WIBs to transfer to BatPay account (including decimals)
 *         example: '100000000000'
 *         required: true
 */
router.post('/bat-pay/deposit', asyncError(async (req, res) => {
  const { contracts: { batPay } } = req.app.locals;
  const { nonce, gasPrice, params } = req.body;
  const sign = builder(batPay, 'deposit');
  const { errors, result } = sign(nonce, gasPrice, { ...params, id: buyer.getId() });

  if (errors) {
    res.boom.badData('Operation failed', { errors });
  } else {
    res.json({ signedTransaction: result });
  }
}));

export default router;
