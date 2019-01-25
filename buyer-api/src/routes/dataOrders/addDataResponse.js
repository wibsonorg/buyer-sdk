import express from 'express';
import { asyncError } from '../../utils';
import { addDataResponse } from '../../operations/createDataOrder';

const router = express.Router();

/**
 * @swagger
 * /data-responses:
 *   post:
 *     description: |
 *       # STEP 4 from Wibson's Protocol
 *       ## Buyer accumulates DataResponses to notarize them by batches.
 *     parameters:
 *       - in: body
 *         name: dataOrder
 *         type: object
 *         required: true
 *         schema:
 *           $ref: "#/definitions/DataResponseForBuyer"
 *     responses:
 *       200:
 *         description: When the data response was added and closed correctly
 *       500:
 *         description: When the data response could not be added or closed.
 */

// DataResponseForBuyer: {
//   orderId,
//     sellerAddress,
//     sellerId,
//     encryptedData,
//     decryptedDataHash,
//     decryptionKeyHash,
//   notaryAddress,
//   notaryUrl,
//   needsBuyerRegistration
// }
router.post('/', asyncError(async (req, res) => res.json(await addDataResponse(req.body))));
