import express from 'express';
import { errorResponse, invalidAddressResponse } from '../responses';
import { cache, logger, web3 } from '../utils';

import { getNotaryInfo, getNotariesInfo } from '../facades/notariesFacade';

const router = express.Router();

/**
 * @swagger
 * /notaries:
 *   get:
 *     description: Returns a list of all the notaries' information registered in the Data Exchange
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the list could be fetched correctly.
 *       500:
 *         description: When the fetch failed.
 */
router.get('/', cache('1 day'), async (req, res) => {
  try {
    const result = {
      notaries: await getNotariesInfo(web3),
    };
    res.json(result);
  } catch (err) {
    logger.error(err);
    const error = errorResponse(`Couldn't get notaries. Error: ${err.message}`);
    res.status(500).json(error);
  }
});

/**
 * @swagger
 * /notaries/:notaryAddress
 *   get:
 *     description: Returns the notary's information registered in the Data Exchange
 *     paths:
 *       - name: notaryAddress
 *         description: Notary's ethereum address
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the notary could be fetched correctly.
 *       500:
 *         description: When the fetch failed.
 */
router.get('/:notaryAddress', cache('1 day'), async (req, res) => {
  try {
    const { notaryAddress } = req.params;

    if (!web3.utils.isAddress(notaryAddress)) {
      res.status(400).send(invalidAddressResponse('notaryAddress'));
      return;
    }

    const result = {
      notaries: await getNotaryInfo(web3, notaryAddress),
    };
    res.json(result);
  } catch (err) {
    logger.error(err);
    const error = errorResponse(`Couldn't get notary information. Error: ${err.message}`);
    res.status(500).json(error);
  }
});

export default router;
