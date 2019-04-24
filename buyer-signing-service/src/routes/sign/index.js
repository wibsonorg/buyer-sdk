import express from 'express';
import validate from '../../middlewares/validateSignBody';
import createDataOrder from './createDataOrder';
import closeDataOrder from './closeDataOrder';
import batPayRegisterPayment from './batPayRegisterPayment';
import batPayDeposit from './batPayDeposit';
import tokenIncreaseApproval from './tokenIncreaseApproval';

const router = express.Router();

router.use(validate);
router.use(createDataOrder);
router.use(closeDataOrder);
router.use(batPayRegisterPayment);
router.use(batPayDeposit);
router.use(tokenIncreaseApproval);

export default router;
