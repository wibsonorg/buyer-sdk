import express from 'express';
import jsonwebtoken from 'jsonwebtoken';

import config from '../../config';
import { asyncError, fetchToken } from '../utils';

const router = express.Router();

router.post('/', asyncError(async (req, res) => {
  const { jwt, passphrase } = config;
  const { password } = req.body;
  if (!password || password !== passphrase) {
    return res.boom.unauthorized('Password is incorrect');
  }
  const token = jsonwebtoken.sign({}, jwt.secret, { expiresIn: jwt.expiration });
  res.status(200).json({
    authenticated: true,
    token,
  });
}));

router.get('/verify-token', asyncError(async (req, res) => {
  const token = fetchToken(req);
  if (!token) {
    return res.boom.unauthorized('No token provided');
  }
  jsonwebtoken.verify(token, config.jwt.secret, (err, decoded) => {
    const error = err && err.name;
    if (error === 'TokenExpiredError') {
      return res.boom.unauthorized('token is expired');
    }
    return res.status(200).send();
  });
}));

export default router;
