import express from 'express';
import newOrder from './newOrder';
import addNotaryToOrder from './addNotaryToOrder';
import addDataResponse from './addDataResponse';
import closeDataResponse from './closeDataResponse';
import closeOrder from './closeOrder';

const router = express.Router();

router.use(newOrder);
router.use(addNotaryToOrder);
router.use(addDataResponse);
router.use(closeDataResponse);
router.use(closeOrder);

export default router;
