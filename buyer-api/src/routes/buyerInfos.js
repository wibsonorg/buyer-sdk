import express from 'express';
import { asyncError, cache, listLevelValues } from '../utils';

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
  cache('1 day'),
  asyncError(async (req, res) => {
    const {
      stores: { buyerInfos },
    } = req.app.locals;
    const values = await listLevelValues(buyerInfos);

    res.json({
      options: values.map(value => JSON.parse(value)),
    });
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
 *       - name: label
 *         description: The label that will appear as the company/project name in the data order.
 *         required: true
 *         type: string
 *         in: body
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
    const {
      stores: { buyerInfos },
    } = req.app.locals;

    let status = 200;
    let message = 'OK';

    try {
      await buyerInfos.get(info.id);
      status = 400;
      message = 'The ID already exists';
    } catch (err) {
      // no previous buyer info was found
      await buyerInfos.put(info.id, JSON.stringify(info));
    }

    res.status(status).json({ message });
  }),
);

export default router;
