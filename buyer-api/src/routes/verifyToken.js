import express from 'express';

import { asyncError } from '../utils';
import checkAuthorization from '../utils/checkAuthorization';

const router = express.Router();
router.use(checkAuthorization);

router.get('/', asyncError(async (req, res) => res.status(200).json({
  valid: true,
})));

export default router;
