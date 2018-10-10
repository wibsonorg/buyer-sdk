import 'babel-polyfill';
import app from './app';
import config from '../config';
import { logger, attachContractEventSubscribers, checkInitialRootBuyerFunds } from './utils';
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
  const enoughFunds = await checkInitialRootBuyerFunds();
  if (!enoughFunds) {
    process.exit(1);
  }

  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Buyer API listening on port ${port} and host ${host} in ${env} mode`));

  attachContractEventSubscribers(contractEventSubscribers, app.locals.stores);

  // TODO: This is going to be replaced by the monitoring recurring function.
};

export default server;
