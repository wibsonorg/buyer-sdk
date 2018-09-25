import express from 'express';
import createDataOrder from './createDataOrder';
import addNotariesToOrder from './addNotariesToOrder';
import closeDataOrder from './closeDataOrder';
import ordersInfo from './ordersInfo';

const router = express.Router();

router.use(createDataOrder);
router.use(addNotariesToOrder);
router.use(closeDataOrder);
router.use(ordersInfo);

export default router;
