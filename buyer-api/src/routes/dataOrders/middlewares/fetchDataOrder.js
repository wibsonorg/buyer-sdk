import { dataOrders } from '../../../utils/stores';

/**
 * Fetch data order and leave it in request
 */
export default async (req, res, next) => {
  const { id } = req.params;

  try {
    req.dataOrder = await dataOrders.fetch(id);
    next();
  } catch (error) {
    res.boom.notFound('DataOrder not found');
  }
};
