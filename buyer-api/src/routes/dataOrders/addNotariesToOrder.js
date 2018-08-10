import express from 'express';
import { addNotariesToOrderFacade } from '../../facades';
import { asyncError } from '../../utils';
import { coercion } from '../../utils/wibson-lib';

const { isPresent } = coercion;

const router = express.Router();

const validate = ({ orderAddress, notariesAddresses }) =>
  Object.entries({
    orderAddress,
    notariesAddresses,
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
 *         name: notariesAddresses
 *         type: array
 *         required: true
 *         description: Addresses of the Notaries to be added
 *         items:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When notary or notaries where added successfully
 *         schema:
 *           type: object
 *           properties:
 *             orderAddress:
 *               type: string
 *               description: Order address
 *             notariesAddresses:
 *               type: array
 *               description: Addresses of the notaries added to the order
 *               items:
 *                 type: string
 *       422:
 *         description: When there is a problem with the input
 *       500:
 *         description: Problem on our side
 */
router.post('/:orderAddress/notaries', asyncError(async (req, res) => {
  const { orderAddress } = req.params;
  const { notariesAddresses } = req.body;
  const errors = validate({ orderAddress, notariesAddresses });

  if (errors.length > 0) {
    res.boom.badData('Validation failed', { validation: errors });
  } else {
    const response = await addNotariesToOrderFacade(
      orderAddress,
      notariesAddresses,
    );

    if (response.success()) {
      res.json(response.result);
    } else {
      res.boom.internal('Operation failed', {
        errors: response.errors,
      });
    }
  }
}));

export default router;
