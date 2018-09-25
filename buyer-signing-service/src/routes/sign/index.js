import express from 'express';
import validateSigningParams from '../../middlewares/validateSigningParams';
import newOrder from './newOrder';
import addNotaryToOrder from './addNotaryToOrder';
import increaseApproval from './increaseApproval';
import addDataResponse from './addDataResponse';
import closeDataResponse from './closeDataResponse';
import closeOrder from './closeOrder';

const router = express.Router();

router.use(validateSigningParams);
router.use(newOrder);
router.use(addNotaryToOrder);
router.use(increaseApproval);
router.use(addDataResponse);
router.use(closeDataResponse);
router.use(closeOrder);

export default router;
