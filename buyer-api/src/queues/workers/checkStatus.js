import { fundingQueue } from '../fundingQueue';
import {
  storeAccountMetrics,
  incrementAccountCounter,
} from '../../facades/metricsFacade';
import { getTransactionReceipt, retryAfterError } from '../../facades/helpers';
import { web3, logger } from '../../utils';

export default async ({
  data: {
    currency,
    account,
    receipt,
    enqueueAfterConfirmation = {},
  },
}) => {
  const { jobName, payload, options } = enqueueAfterConfirmation;

  try {
    if (receipt) {
      await getTransactionReceipt(web3, receipt);
      const timesSucceeded = await incrementAccountCounter(account, `${currency}:timesSucceeded`);
      await storeAccountMetrics(account, {
        [`${currency}:lastFund`]: Date.now(),
        [`${currency}:timesSucceeded`]: timesSucceeded,
      });
    }

    if (jobName) {
      fundingQueue.add(jobName, payload, options);
    }
  } catch (error) {
    if (!retryAfterError(error)) {
      logger.error(`Transfer of ${currency} failed (it will not be retried)` +
        ` | reason: ${error.message}`);
      const timesFailed = await incrementAccountCounter(account, `${currency}:timesFailed`);
      await storeAccountMetrics(account, {
        [`${currency}:lastFund`]: Date.now(),
        [`${currency}:timesFailed`]: timesFailed,
      });
    } else {
      throw error;
    }
  }
};
