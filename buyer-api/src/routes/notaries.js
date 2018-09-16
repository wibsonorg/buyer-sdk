import express from 'express';
import { asyncError, cache, validateAddress } from '../utils';

import { getNotaryInfo, getNotariesInfo } from '../facades/notariesFacade';
import checkAuthorization from '../utils/checkAuthorization';

const router = express.Router();
router.use(checkAuthorization);


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
router.get('/', cache('1 day'), asyncError(async (req, res) => {
  req.apicacheGroup = '/notaries/*';
  const { stores: { notariesCache } } = req.app.locals;

  const result = {
    notaries: await getNotariesInfo(notariesCache),
  };
  res.json(result);
}));

/**
 * @swagger
 * /notaries/:notaryAddress:
 *   get:
 *     description: Returns the notary's information registered in the Data Exchange
 *     parameters:
 *       - name: notaryAddress
 *         description: Notary's ethereum address
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the notary could be fetched correctly.
 *       404:
 *         description: When the notary is not registered in the Data Exchange.
 *       500:
 *         description: When the fetch failed.
 */
router.get('/:notaryAddress', cache('1 day'), validateAddress('notaryAddress'), asyncError(async (req, res) => {
  req.apicacheGroup = '/notaries/*';
  const { stores: { notariesCache } } = req.app.locals;
  const { notaryAddress } = req.params;

  const result = await getNotaryInfo(notaryAddress, notariesCache);
  if (result.isRegistered) {
    res.json(result);
  } else {
    res.status(404).send();
  }
}));

export default router;
