import express from 'express';
import { asyncError } from '../../helpers';
import transferWIBFacade from '../../facades/sign/transferWIBFacade';
import transferETHFacade from '../../facades/sign/transferETHFacade';
import config from '../../../config';

const router = express.Router();

/**
 * @swagger
 * /sign/transfer/{currency}:
 *   post:
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: account
 *         type: integer
 *         description: The account index to use for the signature
 *         required: true
 *       - in: body
 *         name: nonce
 *         type: integer
 *         description: |
 *           The number of transactions made by the sender including this one.
 *         required: true
 *       - in: body
 *         name: gasPrice
 *         type: string
 *         description: The number of transactions made by the sender.
 *         required: true
 *       - in: body
 *         name: params
 *         description: Parameters to be used in the transaction call.
 *         schema:
 *           $ref: "#/definitions/TransferParameters"
 *       - in: body
 *         name: currency
 *         type: string
 *         description: The currency of the amount to be transferred.
 *         required: true
 *         enum: [wib, eth]
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *         schema:
 *           type: object
 *           properties:
 *             signedTransaction:
 *               type: string
 *               description: Serialized transaction
 *       422:
 *         description: When one or more validations failed
 *       500:
 *         description: Problem with the signing process
 *
 * definitions:
 *   TransferParameters:
 *     type: object
 *     properties:
 *       _to:
 *         type: string
 *         description: Destinatary's ethereum address
 *         required: true
 *       _value:
 *         type: string
 *         description: Amount to be transferred
 *         required: true
 */
router.post('/transfer/:currency', asyncError(async (req, res) => {
  const { contracts: { token } } = req.app.locals;
  const { nonce, gasPrice, params } = req.body;
  const { currency } = req.params;

  let operation = null;
  if (currency === 'wib') {
    operation = transferWIBFacade;
  } else if (currency === 'eth') {
    operation = transferETHFacade;
  }

  if (operation) {
    const response = operation(nonce, gasPrice, params, token, {
      chainId: config.contracts.chainId,
      gasLimit: config.contracts.wibcoin.transfer.gasLimit,
      to: config.contracts.wibcoin.address,
    });

    if (response.success()) {
      res.json({ signedTransaction: response.result });
    } else {
      res.boom.badData('Operation failed', {
        errors: response.errors,
      });
    }
  } else {
    res.boom.badData('Invalid currency');
  }
}));

export default router;
