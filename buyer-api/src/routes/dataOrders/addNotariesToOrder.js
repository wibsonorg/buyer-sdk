import express from 'express';
import { addNotariesToOrderFacade } from '../../facades';
import { asyncError } from '../../utils';

const router = express.Router();

const isPresent = v => v !== null && v !== undefined;

const validate = ({ orderAddress, notaries }) =>
  Object.entries({
    orderAddress,
    notaries,
  }).reduce((accumulator, [field, value]) => {
    if (!isPresent(value)) {
      return [...accumulator, `Field '${field}' is mandatory`];
    }

    return accumulator;
  }, []);

/**
 * @swagger
 * /orders/{orderAddress}/notaries:
 *   post:
 *     description: |
 *       # STEP 3 from Wibson's Protocol
 *       ## Buyer adds one or more notaries to a specific order
 *     parameters:
 *       - in: path
 *         name: orderAddress
 *         type: string
 *         required: true
 *         description: Address of the order where the notaries need to be added
 *         example: 0xa662a5c63079009d79740f4e638a404f7917f93a
 *       - in: body
 *         name: notaries
 *         type: array
 *         required: true
 *         description: Notaries information
 *         items:
 *           type: object
 *           schema:
 *             $ref: "#/definitions/Notary"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When notary or notaries where added successfully
 *       422:
 *         description: When there is a problem with the input
 *       500:
 *         description: Problem on our side
 *
 * definitions:
 *   Notary:
 *     type: object
 *     properties:
 *       notaryAddress:
 *         type: string
 *         required: true
 *         description: Address of the notary
 *         example: 0x5ee6fd4d54540333c148885d52e81f39c256761a
 *       responsesPercentage:
 *         type: integer
 *         required: true
 *         description: |
 *           Percentage of `DataResponses` to audit per DataOrder.
 *           Value must be between 0 and 100.
 *         example: 30
 *       notarizationFee:
 *         type: integer
 *         required: true
 *         description: Fee to be charged per validation done.
 *         example: 10
 *       notarizationTermsOfService:
 *         type: string
 *         required: true
 *         description: Notary's terms and conditions for the order.
 *         example: Terms and Conditions for DataOrder
 *       notarySignature:
 *         type: string
 *         required: true
 *         description: Notary's signature over the other arguments.
 *         example: 3164c60ef3e26cb8c1d97effe36777ad8f45341c8b400fda5e5c5f57a9eb
 */
router.post('/:orderAddress/notaries', asyncError(async (req, res) => {
  const { dataExchange } = req.app.locals.contracts;
  const { orderAddress } = req.params;
  const { notaries } = req.body;
  const errors = validate({ orderAddress, notaries });

  if (errors.length > 0) {
    res.boom.badData('Validation failed', { validation: errors });
  } else {
    const response = await addNotariesToOrderFacade(
      orderAddress,
      notaries,
      dataExchange,
    );

    if (response.success()) {
      res.json(response.result);
    } else {
      res.boom.badData('Operation failed', {
        errors: response.errors,
      });
    }
  }
}));

export default router;
