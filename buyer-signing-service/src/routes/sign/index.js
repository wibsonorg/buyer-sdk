import express from 'express';
import newOrder from './newOrder';
import addNotaryToOrder from './addNotaryToOrder';

const router = express.Router();

router.use(newOrder);
router.use(addNotaryToOrder);

export default router;
