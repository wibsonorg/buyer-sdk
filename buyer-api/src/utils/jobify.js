import Queue from 'bull';
import config from '../../config';
import logger from './logger';

const { url, prefix, jobs: { concurrency } } = config.redis;

const logEvent = (q, event) => ({ id = '', name, failedReason: err }) => {
  const job = q !== name ? `:${name}` : '';
  const end = err ? `\n   Reason: ${err}` : '';
  logger.info(`[${q}:${id}${job}] ${event}.${end}`);
};

/**
 * Jobified queues
 * @type {Object<string,import('bull').Queue>}
 */
export const queues = {};

/**
 * @typedef JobsQueue
 * @property {Object<String, Function>} jobHandlers Handlers for the jobs
 * @augments import('bull').Queue
 * Creates a new jobs queue
 * @param {string} name Name of the queue
 * @param {import('bull').JobOptions} options Default job options
 * @param {import('bull').AdvancedSettings} settings Queue settings
 * @returns {import('bull').Queue & JobsQueue}
 */
export function createQueue(name, options = {}, settings = {}) {
  const q = new Queue(name, url, {
    prefix: `${prefix}:${name}:jobs`,
    defaultJobOptions: {
      backoff: { type: 'linear' },
      attempts: 20,
      ...options,
    },
    settings: {
      backoffStrategies: {
        linear: attemptsMade => attemptsMade * 10 * 1000,
      },
      ...settings,
    },
  });
  q.on('active', logEvent(name, 'started'));
  q.on('failed', logEvent(name, 'failed'));
  q.on('paused', logEvent(name, 'paused'));
  q.on('completed', logEvent(name, 'completed'));
  q.jobHandlers = {};
  q.process('*', options.concurrency || 1, job => q.jobHandlers[job.name].apply(job, job.data));
  queues[name] = q;
  return q;
}

const jobsQ = createQueue('Job', { concurrency });

/**
 * Turns a function in a job
 * @param {F & Function} fn An async function to be used as handler for the job
 * @param {Object} [options] Job options
 * @param {string} [options.name=fn.name] Name of the job [required] (default: [fn.name])
 * @param {import('bull').Queue} [options.queue=] Name of the queue
 * @param {number} [options.priority=] Job priority in the queue (default: [undefined])
 * @returns {F} A function with the same signature as [fn]
 * @template F
 */
export function jobify(fn, { name = fn.name, queue = jobsQ, priority } = {}) {
  // eslint-disable-next-line no-param-reassign
  queue.jobHandlers[name] = fn;
  return async (...args) => (await queue.add(name, args, { priority })).finished();
}
