import express from 'express';
import { asyncError, cache, validateAddress, listLevelValues } from '../utils';
import getBuyerInfo from '../services/buyerInfo';

const router = express.Router();

/**
 * @swagger
 * /orders/info:
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
 * /orders/info/create:
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
  '/create',
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

/**
 * @swagger
 * /orders/info/:orderAddress:
 *   get:
 *     description: Returns extra information about the Data Order, such as buyer and project names,
 *                  category, etc.
 *     parameters:
 *       - name: orderAddress
 *         description: Ethereum address of the Data Order.
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the information could be fetched correctly.
 *       404:
 *         description: When the Data Order was not created by the buyer.
 *       500:
 *         description: When the fetch failed.
 */
router.get(
  '/:orderAddress',
  cache('30 days'),
  validateAddress('orderAddress'),
  asyncError(async (req, res) => {
    const { orderAddress } = req.params;
    const {
      stores: { buyerInfos, buyerInfoPerOrder },
    } = req.app.locals;

    try {
      const buyerInfo = await getBuyerInfo(orderAddress, buyerInfoPerOrder, buyerInfos);
      res.json(buyerInfo);
    } catch (err) {
      res.status(404).send();
    }
  }),
);

export default router;
