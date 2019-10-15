import R from 'ramda';
import { notarizations, dataResponsesBatches, dataOrders } from '../utils/stores';
import logger from '../utils/logger';

export default async () => {
  const allNotarization = await notarizations.list();

  logger.info('Hung notarizations:');
  R.pipe(
    R.reject(R.or(
      R.propEq('status', 'responded'),
      R.propEq('statusReason', 'Status set in migration to BatPay v2.1'),
    )),
    R.map(n => ({
      id: n.id,
      orderId: n.request && n.request.orderId,
      lockingKeyHash: n.result && n.result.lockingKeyHash,
      status: n.status,
      respondedAt: n.respondedAt,
      statusReason: n.statusReason,
      sellersLength: n.result && n.result.sellers && n.result.sellers.length,
    })),
    R.forEach(n => logger.info(JSON.stringify(n))),
  )(allNotarization);

  const batches = await dataResponsesBatches.list();
  logger.info('Hung Data Responses Batches:');
  batches
    .filter(b => b.status !== 'processed')
    .forEach(batch => logger.info(JSON.stringify(batch)));

  logger.info('Rejected Sellers By Order ID:');
  const rejectedS = R.pipe(
    R.filter(R.propEq('status', 'responded')),
    R.map(n => ({
      orderId: n.request && n.request.orderId,
      rejected:
        n.request && n.result
          ? R.uniq(R.difference(n.request.sellers, n.result.sellers)).length
          : 0,
    })),
    R.reduceBy((acc, { rejected }) => acc + rejected, 0, n => n.orderId),
  )(allNotarization);

  const promises = Object.keys(rejectedS).map(orderId => dataOrders.fetchByDxId(orderId));
  const orders = await Promise.all(promises);
  orders.forEach(({ dxId, requestedData }) =>
    logger.info(`${dxId} [${requestedData}]: ${rejectedS[dxId]}`));
  logger.info(`Total: ${Object.values(rejectedS).reduce((acc, s) => acc + s, 0)}`);
};
