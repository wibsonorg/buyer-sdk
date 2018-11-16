import { web3, logger } from '../utils';
import { getTransactionReceipt } from '../facades/helpers';
import { dataResponseQueue } from './dataResponseQueue';

const retryPendingDataResponse = async (job) => {
  const { name, data: { orderAddress, sellerAddress, receipt } } = job;

  const jobName = name === 'closeDataResponseSent' ? 'closeDataResponse' : 'buyData';

  try {
    await getTransactionReceipt(web3, receipt);
  } catch (err) {
    job.update({ ...job.data, retried: true });

    dataResponseQueue.add(jobName, { orderAddress, sellerAddress }, {
      attempts: 20,
      backoff: {
        type: 'linear',
      },
    });
  }
};

const retryPendingDataResponses = async (failedJobs) => {
  const pendingJobs = failedJobs.filter(job =>
    job.data.receipt &&
    job.attemptsMade >= 20 &&
    job.failedReason.toLowerCase().includes('pending') &&
    ['addDataResponseSent', 'closeDataResponseSent'].includes(job.name));

  await Promise.all(pendingJobs.map(job => retryPendingDataResponse(job)));
};

const retryPendingJobs = async (failedJobs) => {
  await retryPendingDataResponses(failedJobs);
};

const getFailedJobs = async (queue) => {
  const failedJobs = await queue.getFailed();
  return failedJobs.filter(job => !job.data.retried);
};

const retryFailed = async () => {
  logger.info('Retrying failed jobs');
  const failedJobs = await getFailedJobs(dataResponseQueue);
  await retryPendingJobs(failedJobs);
  logger.info('Finished enqueuing failed jobs');
};

export { retryFailed };
