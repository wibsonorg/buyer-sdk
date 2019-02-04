import { dataOrders } from '../../../utils/stores';

/**
 * Fetch data order and leave it in request
 */
export default async (req, res, next) => {
  try {
    req.dataOrder = await dataOrders.fetch(req.params.id);
    next();
  } catch (error) {
    res.boom.notFound('DataOrder not found');
  }
};
