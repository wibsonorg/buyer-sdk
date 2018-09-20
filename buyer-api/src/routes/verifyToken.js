import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

import { asyncError } from '../utils';

const router = express.Router();

router.get('/', asyncError(async (req, res) => {
  const authorizationInHeaders = req && req.headers && req.headers.authorization;
  const authorizationInCookies = req && req.cookies;
  const token = authorizationInHeaders ? authorizationInHeaders.replace('Bearer ', '') : authorizationInCookies && authorizationInCookies.accessJwt;
  if (!token) {
    return res.status(401).json({
      invalid: true, message: 'No token provided',
    });
  }
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    const error = err && err.name;
    if (error === 'TokenExpiredError') {
      return res.status(200).json({
        invalid: true, message: 'token is expired',
      });
    }
    return res.status(200).json({
      invalid: false,
    });
  });
}));

export default router;
