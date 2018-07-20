import express from 'express';
import newOrder from './newOrder';
import addDataResponse from './addDataResponse';
import closeDataResponse from './closeDataResponse';
import addNotaryToOrder from './addNotaryToOrder';

const router = express.Router();

router.use(newOrder);
router.use(addNotaryToOrder);
router.use(addDataResponse);
router.use(closeDataResponse);

export default router;
