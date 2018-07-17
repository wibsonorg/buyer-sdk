import express from 'express';
import { asyncError } from '../utils';
import { addDataResponse } from '../facades';

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
  const { contracts: { DataOrderContract } } = req.app.locals;

  await addDataResponse(
    DataOrderContract,
    orderAddress,
    sellerAddress,
  );

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
