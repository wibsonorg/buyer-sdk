import { fetchDataOrder } from '../../../utils/stores';

/**
 * Fetch data order and leave it in request
 */
export default async (req, res, next) => {
  const { uuid } = req.params;

  try {
    req.dataOrder = await fetchDataOrder(uuid);
    next();
  } catch (error) {
    res.boom.notFound('DataOrder not found');
  }
}
