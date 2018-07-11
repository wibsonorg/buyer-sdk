import express from 'express';
import { createDataOrder } from '../facades';
import { asyncError } from '../middlewares/error-handling';

const router = express.Router();

const toString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if ('toString' in value) return value.toString();
};

/**
 * @swagger
 * /data-orders:
 *   post:
 *     description: |
 *       # STEP 1 from Wibson's Protocol
 *       ## Buyer creates a DataOrder
 *     parameters:
 *       - in: body
 *         name: filters
 *         type: string
 *         description: Target audience of the order
 *         example: { age: 20 }
 *       - in: body
 *         name: dataRequest
 *         type: string
 *         description: Requested data type (Geolocation, Facebook, etc)
 *         example: Geolocalization (last 30 days)
 *       - in: body
 *         name: price
 *         type: integer
 *         description: Price per added Data Response
 *         example: 20
 *       - in: body
 *         name: initialBudgetForAudits
 *         type: integer
 *         description: The initial budget set for future audits
 *         example: 10
 *       - in: body
 *         name: termsAndConditions
 *         type: string
 *         description: The initial budget set for future audits
 *         example: Terms and Conditions
 *       - in: body
 *         name: buyerURL
 *         type: string
 *         required: true
 *         description: Public URL of the buyer where the data must be sent
 *         example: https://buyer.com/submit-your-data
 *       - in: body
 *         name: buyerPublicKey
 *         type: string
 *         required: true
 *         description: |
 *           Public Key of the buyer, which will be used to encrypt the data to
 *           be sent.
 *         example: public-key
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app is OK
 *       422:
 *         description: When the app is OK
 */
router.post('/', asyncError(async (req, res) => {
  const {
    filters,
    dataRequest,
    price,
    initialBudgetForAudits,
    termsAndConditions,
    buyerUrl,
    buyerAddress,
  } = req.body;

  if (toString(buyerUrl).length === 0) {
    // res.boom.badData(...)
    res.status(422).json({ status: 'unprocessable_entity' });
  } else {
    const response = await createDataOrder({
      filters,
      dataRequest,
      price,
      initialBudgetForAudits,
      termsAndConditions,
      buyerUrl, // WHERE IS THIS STORED?
      buyerAddress,
    });

    res.json(response);
  }
}));

export default router;
