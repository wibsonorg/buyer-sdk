import Router from 'express-promise-router';
import { createDataOrder } from '../../operations/createDataOrder';
import { validateAddress } from '../../utils';

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     description: |
 *       # STEP 1 from Wibson's Protocol
 *       ## Buyer creates a DataOrder
 *     parameters:
 *       - in: body
 *         name: dataOrder
 *         required: true
 *         schema:
 *           $ref: "#/definitions/DataOrder"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the DataOrder is created
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: uuid of the DataOrder
 *             status:
 *               type: string
 *               description: Status of the transaction
 *       422:
 *         description: When there is a problem with the input
 *       500:
 *         description: Problem on our side
 *
 * definitions:
 *   DataOrder:
 *     type: object
 *     required:
 *        - audience
 *        - price
 *        - requestedData
 *        - buyerInfoId
 *        - notariesAddresses
 *     properties:
 *       audience:
 *         type: object
 *         description: Target audience of the order
 *         example: { "age": 20 }
 *       price:
 *         type: number
 *         description: Price per added Data Response
 *         example: 42
 *       requestedData:
 *         type: array
 *         items:
 *           type: string
 *           pattern: '^[0-9a-zA-Z\-]+$'
 *         description: Requested data type (Geolocation, Facebook, etc)
 *         example: ["some-data-type"]
 *       buyerInfoId:
 *         type: string
 *         description: The ID for the buyer info
 *         example: 'some-buyer-id'
 *       notariesAddresses:
 *         type: array
 *         items:
 *           type: string
 *           pattern: '^0x[0-9a-fA-F]{40}$'
 *         description: Notaries' Ethereum addresses
 *         example: ["0x7befc633bd282f7938ef8349a9fca281cf06bada"]
 */
router.post('/', validateAddress('body.notariesAddresses'), async (req, res) =>
  res.json(await createDataOrder(req.body)));

export default router;
