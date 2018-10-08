import 'babel-polyfill';
import app from './app';
import config from '../config';
import { logger, attachContractEventSubscribers } from './utils';
import contractEventSubscribers from './contractEventSubscribers';

const server = () => {
  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Buyer API listening on port ${port} and host ${host} in ${env} mode`));

  attachContractEventSubscribers(contractEventSubscribers, app.locals.stores);

  // TODO: This is going to be replaced by the monitoring recurring function.
  setInterval(() => {
    const { funding } = app.locals.queues;
    funding.add('sendFunds', {
      accountNumber: 2,
      config: {
        wib: { min: '1e+10', max: '1e+12' },
        eth: { min: '1e+18', max: '2e+18' },
      },
    });
  }, 1000 * 60 * 1);
};

export default server;
