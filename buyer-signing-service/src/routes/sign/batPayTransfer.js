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
 *       ## ...
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
 *       fromId:
 *         type: number
 *         description: Sender's ID
 *         required: true
 */
router.post('/bat-pay/transfer', asyncError(async (req, res) => {
  const { contracts: { batPay } } = req.app.locals;
  const { nonce, gasPrice, params } = req.body;
  const sign = builder(batPay, 'transfer');
  console.log('HERE!')
  let { errors, result } = {}
  try {
    ({ errors, result } = sign(nonce, gasPrice, { ...params, fromId: buyer.getId() }));
  } catch (error) {
    console.log('HERE! 2', error)
  }

  if (errors) {
    res.boom.badData('Operation failed', { errors });
  } else {
    res.json({ signedTransaction: result });
  }
}));

export default router;
