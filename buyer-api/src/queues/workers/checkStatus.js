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
    enqueueAfterConfirmation: {
      jobName,
      payload,
      options,
    } = {},
  },
}) => {
  try {
    logger.info('[checkStatus]', { currency, receipt });

    if (receipt) {
      await getTransactionReceipt(web3, receipt);
      await incrementAccountCounter(account, `${currency}:timesSucceded`);
      await storeAccountMetrics(account, { [`${currency}:lastFund`]: Date.now() });
    }

    if (jobName) {
      fundingQueue.add(jobName, payload, options);
    }
  } catch (error) {
    if (!retryAfterError(error)) {
      logger.error(`Could not transfer ${currency} failed (it will not be retried)` +
        ` | reason: ${error.message}`);
      await incrementAccountCounter(account, `${currency}:timesFailed`);
    } else {
      throw error;
    }
  }
};
