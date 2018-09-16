import jwt from 'jsonwebtoken';
import config from '../../config';

function checkAuthorization(req, res, next) {
  const authorizationInHeaders = req && req.headers && req.headers.authorization;
  const authorizationInCookies = req && req.cookies;
  const token = authorizationInHeaders ? authorizationInHeaders.replace('Bearer ', '') : authorizationInCookies && authorizationInCookies.accessJwt;
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    next();
  });
}

export default checkAuthorization;
