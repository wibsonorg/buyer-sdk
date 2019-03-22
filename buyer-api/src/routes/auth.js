import Router from 'express-promise-router';
import jsonwebtoken from 'jsonwebtoken';

import config from '../../config';
import { fetchToken } from '../utils';

const router = Router();

/**
 * @swagger
 * /authentication:
 *   post:
 *     description: Gets a jwt token from a password
 *     parameters:
 *       - in: body
 *         name: credentials
 *         schema:
 *            required:
 *              - password
 *            properties:
 *              password:
 *                type: string
 *                description: Login password
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the password is correct.
 *       422:
 *         description: When the password is incorrect.
 *       500:
 *         description: When the login fails.
 */
router.post('/', async (req, res) => {
  const { jwt, passphrase } = config;
  if (req.body.password === passphrase) {
    const token = jsonwebtoken.sign({}, jwt.secret, { expiresIn: jwt.expiration });
    res.status(200).json({ token, authenticated: true });
  } else {
    res.boom.unauthorized('Incorrect Password', { authenticated: false });
  }
});

router.get('/verify-token', async (req, res) => {
  const token = fetchToken(req);
  if (!token) {
    res.boom.unauthorized('No token provided');
  } else {
    const error = await new Promise(resolve => // eslint-disable-next-line no-unused-vars
      jsonwebtoken.verify(token, config.jwt.secret, (err, decoded) => resolve(err && err.name)));
    if (error === 'TokenExpiredError') {
      res.boom.unauthorized('Token expired');
    } else {
      res.json({ statusCode: 'OK' });
    }
  }
});

export default router;
