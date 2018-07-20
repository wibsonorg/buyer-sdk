import express from 'express';
import newOrder from './newOrder';
import addNotaryToOrder from './addNotaryToOrder';
import closeOrder from './closeOrder';

const router = express.Router();

router.use(newOrder);
router.use(addNotaryToOrder);
router.use(closeOrder);

export default router;
