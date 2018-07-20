import express from 'express';
import { asyncError } from '../../helpers';
import signCloseDataResponseFacade from '../../facades/sign/closeDataResponseFacade';

const router = express.Router();

const isPresent = obj => obj !== null && obj !== undefined;

const validateParameters = ({
  orderAddr,
  seller,
  wasAudited,
  isDataValid,
  notarySignature,
}) => {
  const fields = {
    orderAddr,
    seller,
    wasAudited,
    isDataValid,
    notarySignature,
  };

  return Object.entries(fields).reduce((accumulator, [field, value]) => {
    if (!isPresent(value)) {
      return [...accumulator, `Field '${field}' is required`];
    }

    return accumulator;
  }, []);
};

/*
 * Checks that `nonce` and one of `params` or `payload` are
 * present.
 */
const validate = ({ nonce, params, payload }) => {
  let errors = [];

  if (!isPresent(nonce)) {
    errors = ['Field \'nonce\' is required'];
  }

  if (!isPresent(params) && !isPresent(payload)) {
    errors = [
      ...errors,
      'Field \'params\' or \'payload\' must be provided',
    ];
  }

  if (isPresent(params)) {
    errors = [
      ...errors,
      ...validateParameters(params),
    ];
  }

  return errors;
};

/**
 * @swagger
 * /sign/close-data-response:
 *   post:
 *     description: |
 *       ## Sign closeDataResponse Transaction
 *       Receives DataExchange.closeDataResponse parameters or a serialized payload and
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
 *         name: params
 *         description: Parameters to be used in the transaction call.
 *         schema:
 *           $ref: "#/definitions/AddDataResponseParameters"
 *       - in: body
 *         name: addDataResponsePayload
 *         type: string
 *         description: |
 *           Data payload to be used instead of `addDataResponseParameters`.
 *     responses:
 *       200:
 *         description: When the signing performs successfully
 *       500:
 *         description: Any other case
 *
 * definitions:
 *   params:
 *     type: object
 *     properties:
 *       orderAddr:
 *         type: string
 *         description: Address of the DataOrder.
 *         required: true
 *       seller:
 *         type: string
 *         description: Address of the seller.
 *         required: true
 *       wasAudited:
 *         type: boolean
 *         description: If the data response was audited or not.
 *         required: true
 *       isDataValid:
 *         type: boolean
 *         description: If the data audited is valid.
 *         required: true
 *       notarySignature:
 *         type: string
 *         description: Notary signature.
 *         required: true
 */
router.post('/close-data-response', asyncError(async (req, res) => {
  const { nonce, params, payload } = req.body;
  const errors = validate({ nonce, params, payload });

  if (errors.length > 0) {
    res.boom.badData('Validation failed', { validation: errors });
  } else {
    const response = signCloseDataResponseFacade(nonce, params, payload);

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