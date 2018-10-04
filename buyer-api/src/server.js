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

  setInterval(() => {
    const { funding } = app.locals.queues;
    funding.add('sendFunds', {
      accountNumber: 0,
      config: {
        wib: { min: '1e+12', max: '1e+15' },
        eth: { min: '1e+12', max: '1e+15' },
      },
    });
  }, 5000);
};

export default server;
