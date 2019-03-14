import express from 'express';
import apicache from 'apicache';
import { asyncError, cache } from '../utils';
import {
  getBuyerInfo,
  listBuyerInfos,
  storeBuyerInfo,
} from '../services/buyerInfo';

const router = express.Router();
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
router.get(
  '/',
  cache('30 days'),
  asyncError(async (req, res) => {
    req.apicacheGroup = '/infos/*';
    res.json({ infos: await listBuyerInfos() });
  }),
);

/**
 * @swagger
 * /infos:
 *   post:
 *     description: Creates a new possible information set to be selected on future data orders.
 *     parameters:
 *       - name: id
 *         description: The unique identifier for the piece of information.
 *         required: true
 *         type: string
 *         in: body
 *       - name: name
 *         description: The name of the company.
 *         required: true
 *         type: string
 *         in: body
 *         example: '"Wibson LTD"'
 *       - name: logo
 *         description: The logo url of the company.
 *         required: true
 *         type: string
 *         in: body
 *         example: '"https://dummyimage.com/50x50/3b78fb/fff.png?text=Wibson"'
 *       - name: label
 *         description: The label that will appear as the project name in the data order.
 *         required: true
 *         type: string
 *         in: body
 *         example: '"Wibson || Social Good"'
 *       - name: description
 *         description: The description that will appear for the company/project in the data order.
 *         required: true
 *         type: string
 *         in: body
 *       - name: category.id
 *         description: |
 *           The unique identifier for the category of the company/project in the data order.
 *         required: true
 *         type: string
 *         in: body
 *       - name: category.label
 *         description: The label for the category of the company/project in the data order.
 *         required: true
 *         type: string
 *         in: body
 *       - name: category.description
 *         description: |
 *           The description that will appear for the category of the company/project in
 *           the data order.
 *         required: true
 *         type: string
 *         in: body
 *       - name: category.terms
 *         description: |
 *           Terms and Conditions to be published in data orders associated to
 *           this buyer info
 *         required: true
 *         type: string
 *         in: body
 *     responses:
 *       200:
 *         description: When the buyer info was created correctly.
 *       400:
 *         description: When the information ID already exists.
 *       500:
 *         description: When the creation failed.
 */
router.post(
  '/',
  asyncError(async (req, res) => {
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
  }),
);

export default router;
