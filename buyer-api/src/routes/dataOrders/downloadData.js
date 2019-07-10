import Router from 'express-promise-router';
import { getOrderData } from '../../operations/getOrderData';
import fetchDataOrder from './middlewares/fetchDataOrder';

const router = Router();

/**
 * @swagger
 * /orders/{id}/data:
 *   get:
 *     description: Return the data of sellers in CSV format
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: uuid of the created DataOrder
 *     produces:
 *       - text/plain
 *     responses:
 *       200:
 *         description: When the DataOrder is found and formatted correctly
 *         schema:
 *           type: string
 *       404:
 *         description: When the data is not present on S3.
 *       500:
 *         description: Problem on our side.
 */
router.get('/:id/data', fetchDataOrder, async (req, res) => {
  const { data, error } = await getOrderData(req.dataOrder);
  if (error) {
    switch (error.code) {
      case 'getData.not_found':
        res.boom.notFound(error.message);
        break;
      case 'getData.precondition_failed':
        res.boom.preconditionFailed(error.message);
        break;
      default:
        res.boom.badImplementation(error.message);
    }
  } else {
    res.status(200).send(data);
  }
});

export default router;
