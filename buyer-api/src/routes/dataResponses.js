import express from 'express';
import { asyncError } from '../utils';
import { addDataResponse, closeDataResponse } from '../facades';

const router = express.Router();

const buyData = async (orderAddress, sellerAddress, notariesCache) => {
  await addDataResponse(orderAddress, sellerAddress);

  await closeDataResponse(orderAddress, sellerAddress, notariesCache);
};

/**
 * @swagger
 * /data-responses:
 *   post:
 *     description: Adds a data response and closes it.
 *     responses:
 *       200:
 *         description: When the data response was added and closed correctly
 *       500:
 *         description: When the data response could not be added or closed.
 */
router.post('/', asyncError(async (req, res) => {
  const { orderAddress, sellerAddress } = req.body;
  const { stores: { notariesCache } } = req.app.locals;

  // fire and forget
  buyData(orderAddress, sellerAddress, notariesCache);

  res.status(200).send();
}));

export default router;
