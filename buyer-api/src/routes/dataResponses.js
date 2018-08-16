import express from 'express';
import { asyncError } from '../utils';

const router = express.Router();

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
  const { dataResponse } = req.app.locals.queues;
  const { orderAddress, sellerAddress } = req.body;

  // fire and forget
  dataResponse.add('buyData', { orderAddress, sellerAddress }, {
    attempts: 20,
    backoff: {
      type: 'linear',
    },
  });

  res.status(200).send();
}));

export default router;
