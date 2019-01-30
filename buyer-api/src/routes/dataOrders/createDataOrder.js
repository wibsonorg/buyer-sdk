import Router from 'express-promise-router';
import { createDataOrder } from '../../operations/createDataOrder';

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
 *         type: object
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
 *     properties:
 *       audience:
 *         type: object
 *         required: true
 *         description: Target audience of the order
 *         example: '{ "age": 20 }'
 *       price:
 *         type: number
 *         required: true
 *         description: Price per added Data Response
 *         example: '42'
 *       requestedData:
 *         type: string[]
 *         required: true
 *         description: Requested data type (Geolocation, Facebook, etc)
 *         example: '["some-data-type"]'
 *       buyerInfoId:
 *         type: string
 *         required: true
 *         description: The ID for the buyer info
 *         example: '["some-buyer-id"]'
 *       buyerUrl:
 *         type: string
 *         required: true
 *         description: Public URL of the buyer to get extra information
 *         example: '"https://api.buyer.com"'
 */
router.post('/', async (req, res) => res.json(await createDataOrder(req.body.dataOrder)));

export default router;
