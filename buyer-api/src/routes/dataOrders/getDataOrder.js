import Router from 'express-promise-router';
import { cache } from '../../utils';
import { dataOrders } from '../../utils/stores';

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     description: Returns a list of all data orders created by the buyer in the Data Exchange.
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
  cache('1 minute'),
  async (req, res) => {
    req.apicacheGroup = '/orders/*';
    res.json(dataOrders.list());
  },
);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     description: Returns the data order information.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the order have been fetched correctly.
 *       500:
 *         description: When the fetch failed.
 */
router.get(
  '/:id',
  cache('1 minute'),
  async (req, res) => {
    req.apicacheGroup = '/orders/*';
    res.json(dataOrders.fetch(req.params.id));
  },
);

/**
 * @swagger
 * /orders/{id}/offchain-data:
 *   get:
 *     description: Returns the data order information thats missing from the Data Exchange.
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
    } = dataOrders.fetch(req.params.id);
    res.json(offchainData);
  },
);

export default router;
