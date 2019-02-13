import express from 'express';
import createDataOrder from './createDataOrder';
import getDataOrder from './getDataOrder';
import closeDataOrder from './closeDataOrder';
import ordersInfo from './ordersInfo';
import addDataResponse from './addDataResponse';
import headsUp from './headsUp';
import offchainData from './offchainData';
import checkAuthorization from '../../utils/checkAuthorization';

const router = express.Router();

router.use(addDataResponse);
router.use(ordersInfo);
router.use(headsUp);
router.use(offchainData);
router.use(checkAuthorization);
router.use(createDataOrder);
router.use(getDataOrder);
router.use(closeDataOrder);

export default router;
