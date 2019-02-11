import express from 'express';
import validate from '../../middlewares/validateSignBody';
import createDataOrder from './createDataOrder';
import closeDataOrder from './closeDataOrder';
import batPayTransfer from './batPayTransfer';

const router = express.Router();

router.use(validate);
router.use(createDataOrder);
router.use(closeDataOrder);
router.use(batPayTransfer);

export default router;
