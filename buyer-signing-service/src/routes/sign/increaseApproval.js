import express from 'express';
import { asyncError, validatePresence, isPresent } from '../../helpers';
import increaseApprovalFacade from '../../facades/sign/increaseApprovalFacade';

const router = express.Router();

const validateParameters = ({ spender, addedValue }) => {
  const fields = {
    spender,
    addedValue,
  };

  return Object.entries(fields).reduce((accumulator, [field, v]) => {
    if (!isPresent(v)) {
      return [...accumulator, `Field '${field}' is required`];
    }

    return accumulator;
  }, []);
};

/**
 * @swagger
 * /sign/increase-approval:
 *   post:
 *     description: |
 *       ## Sign IncreaseApproval Transaction
 *       Receives the target address and the value to approve and
 *       responds with the serialized transaction ready to be sent to the
 *       network.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: nonce
 *         type: integer
 *         description: |
 *           The number of transactions made by the sender including this one.
 *         required: true
 *       - in: body
 *         name: spender
 *         description: The target ethereum address
 *       - in: body
 *         name: addedValue
 *         description: The value to approve
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
 */
router.post('/increase-approval', asyncError(async (req, res) => {
  const { nonce, params, payload } = req.body;
  const errors = validatePresence({ nonce, params, payload }, validateParameters);

  if (errors.length > 0) {
    res.boom.badData('Validation failed', { validation: errors });
  } else {
    const txParams = {
      _spender: params.spender,
      _addedValue: Number(params.addedValue),
    };
    const response = increaseApprovalFacade(nonce, txParams);

    if (response.success()) {
      res.json({ signedTransaction: response.result });
    } else {
      res.boom.badData('Operation failed', {
        errors: response.errors,
      });
    }
  }
}));

export default router;
