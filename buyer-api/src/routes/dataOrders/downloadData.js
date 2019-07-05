import Router from 'express-promise-router';
import { getData } from '../../operations/getData';
import fetchDataOrder from './middlewares/fetchDataOrder';

const router = Router();

/**
 * @swagger
 * /orders/{id}/data:
 *   get:
 *     description: Returns a CSV file with the data of sellers
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
 *       422:
 *         description: Problem on our side.
 */
router.get('/:id/data', fetchDataOrder, async (req, res) => {
  const { data, error } = await getData(req.dataOrder);
  if (error && error.code === 'getData.not_found') {
    res.boom.notFound(error.message);
  } else if (error && error.code === 'getData.not_found') {
    res.boom.preconditionFailed(error.message);
  } else if (error) {
    res.boom.badData(error.message);
  } else {
    res.status(200).send(data);
  }
});

export default router;
