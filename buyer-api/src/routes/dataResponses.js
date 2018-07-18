import express from 'express';
import { asyncError } from '../utils';
import { addDataResponse, closeDataResponse } from '../facades';

const router = express.Router();

/**
 * @swagger
 * /data_responses:
 *   post:
 *     description:
 *     responses:
 *       200:
 *         description:
 *       500:
 *         description:
 */
router.post('/', asyncError(async (req, res) => {
  const { orderAddress, sellerAddress } = req.body;

  await addDataResponse(orderAddress, sellerAddress);

  await closeDataResponse(orderAddress, sellerAddress);

  res.status(200).send();
}));

export default router;
