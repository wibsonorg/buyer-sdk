import Router from 'express-promise-router';
import apicache from 'apicache';
import { cache } from '../utils';
import {
  getBuyerInfo,
  listBuyerInfos,
  storeBuyerInfo,
} from '../services/buyerInfo';

const router = Router();
/**
 * @swagger
 * /infos:
 *   get:
 *     description: Returns a list of all possible extra informations about a Data Order.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the list could be fetched correctly.
 *       500:
 *         description: When the fetch failed.
 */
router.get('/', cache('30 days'), async (req, res) => {
  req.apicacheGroup = '/infos/*';
  res.json({ infos: await listBuyerInfos() });
});

/**
 * @swagger
 * /infos:
 *   post:
 *     description: Creates a new possible information set to be selected on future data orders.
 *     parameters:
 *        - in: body
 *          name: buyerInfo
 *          required: true
 *          schema:
 *            $ref: "#/definitions/BuyerInfo"
 *     responses:
 *       200:
 *         description: When the buyer info was created correctly.
 *       400:
 *         description: When the information ID already exists.
 *       500:
 *         description: When the creation failed.
 *
 * definitions:
 *   BuyerInfo:
 *     type: object
 *     required:
 *       - id
 *       - name
 *       - logo
 *       - label
 *       - description
 *       - terms
 *     properties:
 *       id:
 *        type: string
 *        description: The unique identifier for the piece of information.
 *       name:
 *        type: string
 *        description: The name of the company.
 *       logo:
 *        type: string
 *        description: The logo url of the company.
 *       label:
 *         type: string
 *         description: |
 *            The label that will appear as the company/project name in the data order.
 *       description:
 *         type: string
 *         description: |
 *            The description that will appear for the company/project in the data order.
 *       terms:
 *         type: string
 *         description: |
 *           Terms and Conditions to be published in data orders associated to
 *           this buyer info
 *       category:
 *          type: object
 *          required:
 *            - id
 *            - label
 *            - description
 *          properties:
 *             id:
 *               type: string
 *               description: |
 *                The unique identifier for the category
 *                of the company/project in the data order.
 *             label:
 *               type: string
 *               description: |
 *                  The label for the category
 *                  of the company/project in the data order.
 *             description:
 *               type: string
 *               description: |
 *                 The description that will appear for the category
 *                 of the company/project in the data order.
 */
router.post('/', async (req, res) => {
  const buyerInfo = req.body;
  try {
    await getBuyerInfo(buyerInfo.id);
    res.status(400).json({ message: 'The ID already exists' });
  } catch (err) {
    // no previous buyer info was found
    await storeBuyerInfo(buyerInfo.id, buyerInfo);
    apicache.clear('/infos/*');
    res.status(200).json({ message: 'OK' });
  }
});

export default router;
