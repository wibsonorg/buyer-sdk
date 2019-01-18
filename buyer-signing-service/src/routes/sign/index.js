import express from 'express';
import validate from '../../middlewares/validateSignBody';
import createDataOrder from './createDataOrder';
import closeDataOrder from './closeDataOrder';

const router = express.Router();

router.use(validate);
router.use(createDataOrder);
router.use(closeDataOrder);

export default router;
