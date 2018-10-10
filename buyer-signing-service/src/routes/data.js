import express from 'express';
import config from '../../config';
import { cryptography } from '../utils/wibson-lib';

const router = express.Router();

const { privateKey } = config.buyer;

/**
 * @swagger
 * /data/decrypt:
 *   post:
 *     description: |
 *       The main use case of this endpoint is to decrypt the data.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the data could be correctly decrypted
 */
router.post('/decrypt', async (req, res) => {
  const { encryptedData } = req.body;

  const message = await cryptography.decryptWithPrivateKey(privateKey, encryptedData);
  res.json({ message });
});

export default router;
