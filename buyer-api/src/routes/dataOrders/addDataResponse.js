import Router from 'express-promise-router';
import fetchDataOrder from './middlewares/fetchDataOrder';
import { addDataResponse } from '../../operations/addDataResponse';

const router = Router();

/**
 * @swagger
 * /orders/{id}/data-responses:
 *   post:
 *     description: |
 *       # STEP 4 from Wibson's Protocol
 *       ## Buyer accumulates DataResponses to notarize them by batches.
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/DataResponse"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the DataResponse was accepted
 *       422:
 *         description: When the DataResponse has missing or invalid fields
 *       500:
 *         description: When there is a problema processing the DataResponse
 *
 * definitions:
 *   DataResponse:
 *     type: object
 *     required:
 *        - orderId
 *        - sellerAddress
 *        - encryptedData
 *        - decryptedDataHash
 *        - decryptionKeyHash
 *        - notaryAddress
 *        - needsRegistration
 *     properties:
 *       orderId:
 *         type: number
 *         description: Order ID in the DataExchange contract
 *         example: '42'
 *       sellerId:
 *         type: number
 *         description: Seller's ID in the BatPay contract
 *         example: '1085'
 *       sellerAddress:
 *         type: string
 *         description: Seller's Ethereum address
 *         example: '"0xa42df59C5e17df255CaDfF9F52a004221f774f36"'
 *       encryptedData:
 *         type: string
 *         description: Data encrypted with symmetric-key algorithm
 *         example: '"tZ4MsEnfbcDOwqau68aOrQ=="'
 *       decryptedDataHash:
 *         type: string
 *         description: Hash of the raw data
 *         example: '"8f54f1c2d0eb5771cd5bf67a6689fcd6eed9444d91a39e5ef32a9b4ae5ca14ff"'
 *       decryptionKeyHash:
 *         type: string
 *         description: Hash of the key used to encrypt the data
 *         example: '"07855b46a623a8ecabac76ed697aa4e13631e3b6718c8a0d342860c13c30d2fc"'
 *       notaryAddress:
 *         type: string
 *         description: Notary's Ethereum address
 *         example: '"0xccCF90140Fcc2d260186637D59F541E94Ff9288f"'
 *       needsRegistration:
 *         type: boolean
 *         description: Whether the Seller needs to be registered in BatPay or not
 *         example: 'true'
 */
router.post('/:id/data-responses', fetchDataOrder, async (req, res) => {
  const { error, ...result } = await addDataResponse(req.dataOrder, req.body);
  if (error) {
    res.boom.badData('Operation failed', { error });
  } else {
    res.json(result);
  }
});

export default router;
