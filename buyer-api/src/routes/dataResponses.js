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
  const { contracts: { dataExchange, DataOrderContract } } = req.app.locals;

  if (!web3Utils.isAddress(orderAddress) || !web3Utils.isAddress(sellerAddress)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = await DataOrderContract.at(orderAddress);

  if (dataOrder.hasSellerBeenAccepted(sellerAddress)) {
    throw new Error('Data Response has already been added');
  }

  const dataResponse = await getDataResponse(dataOrder, sellerAddress) || {};

  const { notaryAccount, dataHash, signature } = dataResponse;
  if (!(web3Utils.isAddress(notaryAccount) || dataHash || signature)) {
    throw new Error('Invalid data response payload');
  }

  if (!dataOrder.notaries.includes(notaryAccount)) {
    throw new Error('Invalid notary');
  }

  // TODO:
  //
  // 1) Send a request to Buyer SS to create a signed transaction for adding
  // the data response:
  // DataExchange.addDataResponseToOrder(
  //  orderAddress,
  //  sellerAddress,
  //  notaryAccount,
  //  dataHash,
  //  signature
  // )
  //
  // 2) Then write it to the blockchain.
  //
  // 3) Despues le pego al notario para que me pase el certificado y su veredicto.
  //
  // 4) Si la notarizacion dio ok, o `no voy a validar`:
  //      Le pego al Buyer SS para que me devuelva la tx firmada del closeDataResponse:
  //      DataExchange.closeDataResponse(
  //        orderAddress,
  //        sellerAddress,
  //        wasAudited,
  //        isDataValid,
  //        notarySignature
  //      )
  //
  // 5) Bajo la tx al blockchain.
  //
  res.status(200).send();
}));

export default router;
