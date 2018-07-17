import express from 'express';
import web3Utils from 'web3-utils';
import { asyncError } from '../utils';
import { getDataResponse } from '../utils/wibson-lib/storages';

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

  if (!web3Utils.isAddress(orderAddress) || !web3Utils.isAddress(sellerAddress)) {
    throw new Error('Invalid order|seller address');
  }

  const { contracts: { DataOrderContract } } = req.app.locals;
  const dataOrder = await DataOrderContract.at(orderAddress);
  const dataResponse = await getDataResponse(dataOrder, sellerAddress) || {};

  const { notaryAccount, dataHash, signature } = dataResponse;
  if (!(web3Utils.isAddress(notaryAccount) || dataHash || signature)) {
    throw new Error('Invalid data response payload');
  }

  if (!dataOrder.notaries.includes(notaryAccount)) {
    throw new Error('Invalid notary');
  }

  // TODO: Send a request to Buyer SS to create a signed transaction for adding
  // the data response and then write it to the blockchain.
  // DataExchange.addDataResponseToOrder(
  //  orderAddress,
  //  sellerAddress,
  //  notaryAccount,
  //  dataHash,
  //  signature
  // )
  res.status(200).send();
}));

export default router;
