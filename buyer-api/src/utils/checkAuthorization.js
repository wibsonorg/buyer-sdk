import jwt from 'jsonwebtoken';
import config from '../../config';
import { fetchToken } from './';

async function checkAuthorization(req, res, next) {
  const token = fetchToken(req);
  if (!token) {
    res.boom.unauthorized('No token provided');
  } else {
    const error = await new Promise(resolve => // eslint-disable-next-line no-unused-vars
      jwt.verify(token, config.jwt.secret, (err, decoded) => resolve(err)));
    if (error) {
      res.boom.unauthorized('Failed to authenticate token');
    } else {
      next();
    }
  }
}

export default checkAuthorization;
