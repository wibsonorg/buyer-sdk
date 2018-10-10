import 'babel-polyfill';
import app from './app';
import config from '../config';
import { logger, attachContractEventSubscribers, checkRootBuyerFunds } from './utils';
import contractEventSubscribers from './contractEventSubscribers';

const checkConfig = (conf) => {
  let error = false;

  const traverse = (o, p) => {
    Object.entries(o).forEach((entry) => {
      const [k, v] = entry;
      const keyName = p ? `${p}.${k}` : k;

      if (!v) {
        error = true;
        logger.error(`Environment variable '${keyName}' is not defined`);
      } else if (typeof v === 'object') {
        traverse(v, keyName);
      }
    });
  };

  traverse(conf);
  if (error) {
    logger.error('Configuration check failed. Exiting');
    process.exit(1);
  }
};

const server = async () => {
  checkConfig(config);
  await checkRootBuyerFunds();

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
        wib: { min: '1e+10', max: '1e+12' }, // Que lo saque en runtime de config
        eth: { min: '1e+18', max: '2e+18' },
      },
    });
  }, 1000 * 60 * 1);
};

export default server;
