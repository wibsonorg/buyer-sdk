import config from '../../../config';
import { transfer } from '../../facades/transferFacade';

/**
 * Sends Funds to Buyer's child account and enqueues another job to check
 * the status of that transaction.
 *
 * @params {Object} job Job payload.
 */
export default async (job) => {
  const { root, child, currency } = job.data;

  const amounts = config.buyerChild;

  await transfer(root, child, currency, amounts);
};
