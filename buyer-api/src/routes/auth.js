import express from 'express';
import jsonwebtoken from 'jsonwebtoken';

import config from '../../config';
import { asyncError } from '../utils';

const router = express.Router();

router.post('/', asyncError(async (req, res) => {
  const { jwt, passphrase } = config;
  const { password } = req.body;
  if (!password || password !== passphrase) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Password is incorrect',
      },
    });
  }

  const token = jsonwebtoken.sign({}, jwt.secret, { expiresIn: 60 * 1 });
  res.status(200).json({
    ok: true,
    authenticated: true,
    token,
  });
}));

export default router;
