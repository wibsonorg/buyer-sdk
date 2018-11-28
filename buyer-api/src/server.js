import 'babel-polyfill';
import app from './app';
import config from '../config';
import { logger } from './utils';
import attach from './contractEventSubscribers';
import { checkAllowance } from './facades';
import { retryFailed, enqueueTransaction } from './queues';

const server = () => {
  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Buyer API listening on port ${port} and host ${host} in ${env} mode`));

  attach(
    app.locals.stores,
    config.eventSubscribers.lastProcessedBlock,
  );

  setInterval(
    () => attach(
      app.locals.stores,
      config.eventSubscribers.lastProcessedBlock,
    ),
    Number(config.eventSubscribers.interval),
  );

  setInterval(() => checkAllowance(enqueueTransaction), Number(config.allowance.interval));

  setTimeout(retryFailed, 10000);
};

export default server;
