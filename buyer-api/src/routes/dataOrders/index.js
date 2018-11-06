import express from 'express';
import createDataOrder from './createDataOrder';
import closeDataOrder from './closeDataOrder';
import ordersInfo from './ordersInfo';
import checkAuthorization from '../../utils/checkAuthorization';

const router = express.Router();

router.use(ordersInfo);
router.use(checkAuthorization);
router.use(createDataOrder);
router.use(closeDataOrder);

export default router;
