import Router from 'express-promise-router';
import { cache, validateAddress } from '../utils';

import { getNotaryInfo, getNotariesInfo } from '../facades/notariesFacade';

const router = Router();

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
  req.apicacheGroup = '/notaries/*';
  res.json({ notaries: await getNotariesInfo() });
});

/**
 * @swagger
 * /notaries/{notaryAddress}:
 *   get:
 *     description: Returns the notary's information registered in the Data Exchange
 *     parameters:
 *       - in: path
 *         name: notaryAddress
 *         type: string
 *         required: true
 *         description: Notary's ethereum address
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
router.get(
  '/:notaryAddress',
  cache('1 day'),
  validateAddress('params.notaryAddress'),
  async (req, res) => {
    req.apicacheGroup = '/notaries/*';
    const { notaryAddress } = req.params;

    const result = await getNotaryInfo(notaryAddress);
    if (result.isRegistered) {
      res.json(result);
    } else {
      res.status(404).send();
    }
  },
);

export default router;
