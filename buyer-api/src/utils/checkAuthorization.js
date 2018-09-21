import jwt from 'jsonwebtoken';
import config from '../../config';
import { fetchToken } from './';

function checkAuthorization(req, res, next) {
  const token = fetchToken(req);
  if (!token) {
    return res.boom.unauthorized('No token provided');
  }
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.boom.unauthorized('Failed to authenticate token');
    }
    next();
  });
}

export default checkAuthorization;
