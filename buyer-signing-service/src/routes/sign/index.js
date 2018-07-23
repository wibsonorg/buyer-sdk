import express from 'express';
import newOrder from './newOrder';
import increaseApproval from './increaseApproval';
import addDataResponse from './addDataResponse';
import closeDataResponse from './closeDataResponse';
import addNotaryToOrder from './addNotaryToOrder';

const router = express.Router();

router.use(newOrder);
router.use(addNotaryToOrder);
router.use(increaseApproval);
router.use(addDataResponse);
router.use(closeDataResponse);

export default router;
