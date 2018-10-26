import 'babel-polyfill';
import app from './app';
import config from '../config';
import { logger, attachContractEventSubscribers } from './utils';
import contractEventSubscribers from './contractEventSubscribers';
import { refreshOrdersCache } from './facades/getOrdersFacade';

const server = () => {
  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Buyer API listening on port ${port} and host ${host} in ${env} mode`));

  // refreshOrdersCache();
  attachContractEventSubscribers(
    contractEventSubscribers,
    app.locals.stores,
    config.eventSubscribers.lastProcessedBlock,
  );

  setInterval(
    () => attachContractEventSubscribers(
      contractEventSubscribers,
      app.locals.stores,
      config.eventSubscribers.lastProcessedBlock,
    ),
    Number(config.eventSubscribers.interval),
  );
};

export default server;
