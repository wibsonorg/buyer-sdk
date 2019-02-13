import Router from 'express-promise-router';
import { cache } from '../../utils';
import { dataOrders } from '../../utils/stores';

const router = Router();

/**
 * @swagger
 * /orders/{id}/offchain-data:
 *   get:
 *     description: |
 *        Returns the data order information thats missing from the Data Exchange
 *        (offchain data)
 *     parameters:
 *       - in: params
 *         name: id
 *         type: string
 *         required: true
 *         description: The uuid of the DataOrder to be fetched
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the order have been fetched correctly.
 *       500:
 *         description: When the fetch failed.
 */
router.get(
  '/:id/offchain-data',
  cache('1 minute'),
  async (req, res) => {
    req.apicacheGroup = '/orders/*';
    const {
      buyer,
      audience,
      price,
      requestedData,
      termsAndConditionsHash,
      buyerUrl,
      createdAt,
      closedAt,
      ...offchainData
    } = await dataOrders.fetch(req.params.id);
    res.json(offchainData);
  },
);

export default router;
