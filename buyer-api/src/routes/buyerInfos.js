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
 *            required:
 *              - id
 *              - name
 *              - logo
 *              - label
 *              - description
 *            properties:
 *              id:
 *               type: string
 *               description: The unique identifier for the piece of information.
 *              name:
 *               type: string
 *               description: The name of the company.
 *              logo:
 *               type: string
 *               description: The logo url of the company.
 *              label:
 *                type: string
 *                description: |
 *                   The label that will appear as the company/project name in the data order.
 *              description:
 *                type: string
 *                description: |
 *                   The description that will appear for the company/project in the data order.
 *              category:
 *                 type: object
 *                 required:
 *                   - id
 *                   - label
 *                   - description
 *                   - terms
 *                 properties:
 *                    id:
 *                      type: string
 *                      description: |
 *                       The unique identifier for the category
 *                       of the company/project in the data order.
 *                    label:
 *                      type: string
 *                      description: |
 *                         The label for the category
 *                         of the company/project in the data order.
 *                    description:
 *                      type: string
 *                      description: |
 *                        The description that will appear for the category
 *                        of the company/project in the data order.
 *                    terms:
 *                      type: string
 *                      description: |
 *                        Terms and Conditions to be published in data orders associated to
 *                        this buyer info
 *     responses:
 *       200:
 *         description: When the buyer info was created correctly.
 *       400:
 *         description: When the information ID already exists.
 *       500:
 *         description: When the creation failed.
 */
router.post('/', async (req, res) => {
  const info = req.body;
  let status = 200;
  let message = 'OK';

  try {
    await getBuyerInfo(info.id);
    status = 400;
    message = 'The ID already exists';
  } catch (err) {
    // no previous buyer info was found
    await storeBuyerInfo(info.id, info);
    apicache.clear('/infos/*');
  }

  res.status(status).json({ message });
});

export default router;
