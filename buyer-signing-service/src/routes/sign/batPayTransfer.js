import express from 'express';
import {
  asyncError,
  buildMethodSigner as builder,
  buyer,
} from '../../helpers';

const router = express.Router();

/**
 * @swagger
 * /sign/create-data-order:
 *   post:
 *     description: |
 *       ## Sign BatPay.transfer Transaction
 *       Receives BatPay.transfer parameters and responds with the serialized
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
 *           $ref: "#/definitions/BatPayTransferParameters"
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 *
 * definitions:
 *   BatPayTransferParameters:
 *     type: object
 *     properties:
 *       amount:
 *         type: number
 *         description: Amount to be transferred to the Sellers (including decimals)
 *         example: '100000000000'
 *         required: true
 *       fee:
 *         type: number
 *         description: Fee for who has the key that unlocks the power, sorry, the payment
 *         example: '1000000000'
 *         required: true
 *       payData:
 *         type: string
 *         description: Compressed sellers' information who will receive the payment
 *         example: '"0x6964313b696432"'
 *         required: true
 *       newCount:
 *         type: number
 *         description: Number of sellers that need to be registered during transfer
 *         example: '12'
 *         required: true
 *       roothash:
 *         type: string
 *         description: Root hash of the sellers' merkle tree
 *         example: '"0x468e49a01f8bc984472a1991b383c90731f114c042a6a1c39959c774d45028f4"'
 *         required: true
 *       lock:
 *         type: string
 *         description: Hash of the master key for the specified payData
 *         example: '"0x6168652c307c1e813ca11cfb3a601f1cf3b22452021a5052d8b05f1f1f8a3e92"'
 *         required: true
 *       metadata:
 *         type: string
 *         description: Payment metadata
 *         example: '"0x7a9d3a032b8ff274f09714b56ba8e5ed776ec9638ca303069bc3a3267bb22f65"'
 *         required: true
 */
router.post('/bat-pay/transfer', asyncError(async (req, res) => {
  const { contracts: { batPay } } = req.app.locals;
  const { nonce, gasPrice, params } = req.body;
  const sign = builder(batPay, 'transfer');
  const { errors, result } = sign(nonce, gasPrice, { ...params, fromId: buyer.getId() })

  if (errors) {
    res.boom.badData('Operation failed', { errors });
  } else {
    res.json({ signedTransaction: result });
  }
}));

export default router;
