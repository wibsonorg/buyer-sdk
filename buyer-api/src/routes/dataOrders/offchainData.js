import Router from 'express-promise-router';
import { cache } from '../../utils';
import { notaries } from '../../utils/stores';
import fetchDataOrder from './middlewares/fetchDataOrder';
import { getBuyerInfo } from '../../services/buyerInfo';

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
  fetchDataOrder,
  cache('1 minute'),
  async (req, res) => {
    req.apicacheGroup = '/orders/*';
    const {
      status,
      headsUpUrl,
      dataResponsesUrl,
      transactionHash,
      notariesAddresses,
      buyerInfoId,
    } = req.dataOrder;

    const allowedNotaries = await Promise.all(notariesAddresses
      .map(notaryAddress => notaries.fetch(notaryAddress)));

    const {
      name,
      logo,
      label,
      category,
      terms,
    } = await getBuyerInfo(buyerInfoId);

    const offchainData = {
      status,
      headsUpUrl,
      dataResponsesUrl,
      transactionHash,
      notariesAddresses,
      notaries: allowedNotaries,
      buyer: { name, logo },
      label,
      category,
      terms,
    };

    res.json(offchainData);
  },
);

export default router;
