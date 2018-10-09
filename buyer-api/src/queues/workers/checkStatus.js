import { fundingQueue } from '../fundingQueue';
import { getTransactionReceipt, retryAfterError } from '../../facades/helpers';
import { web3, logger } from '../../utils';

export default async ({
  data: {
    name,
    receipt,
    enqueueAfterConfirmation: {
      jobName,
      payload,
      options,
    } = {},
  },
}) => {
  try {
    if (receipt) {
      await getTransactionReceipt(web3, receipt);
    }

    if (jobName) {
      fundingQueue.add(jobName, payload, options);
    }
  } catch (error) {
    if (!retryAfterError(error)) {
      logger.error(`Transaction ${name} failed (it will not be retried)` +
        ` | reason: ${error.message}`);
    }
  }
};
