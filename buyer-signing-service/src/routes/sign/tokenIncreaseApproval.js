import express from 'express';
import {
  asyncError,
  buildMethodSigner as builder,
} from '../../helpers';

const router = express.Router();

/**
 * @swagger
 * /sign/token/increase-approval:
 *   post:
 *     description: |
 *       ## Sign WIBToken.increaseApproval Transaction
 *       Receives WIBToken.increaseApproval parameters and responds with the serialized
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
 *           $ref: "#/definitions/TokenIncreaseApprovalParameters"
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 *
 * definitions:
 *   TokenIncreaseApprovalParameters:
 *     type: object
 *     properties:
 *       _spender:
 *         type: string
 *         description: Ethereum address of the spender
 *         example: '"0xethereum-address"'
 *         required: true
 *       _addedValue:
 *         type: number
 *         description: Amount of WIBs to allow the spender to spend
 *         example: '100000000000'
 *         required: true
 */
router.post('/token/increase-approval', asyncError(async (req, res) => {
  const { contracts: { token } } = req.app.locals;
  const { nonce, gasPrice, params } = req.body;
  const sign = builder(token, 'increaseApproval');
  const { errors, result } = sign(nonce, gasPrice, params);

  if (errors) {
    res.boom.badData('Operation failed', { errors });
  } else {
    res.json({ signedTransaction: result });
  }
}));

export default router;
