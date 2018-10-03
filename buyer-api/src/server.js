import 'babel-polyfill';
import app from './app';
import config from '../config';
import { logger, attachContractEventSubscribers, rootBuyerFunds } from './utils';
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

const checkFunds = () => {
  const {
    rootBuyerAddress,
    childAccountCount,
    currentWib,
    requiredWib,
    currentGwei,
    requiredGwei,
  } = rootBuyerFunds();

  const insufficientWib = currentWib < requiredWib;
  const insufficientEth = currentGwei < requiredGwei;

  if (insufficientWib) {
    logger.error(`
    Root Buyer (${rootBuyerAddress}) does not have enough WIB to fund ${childAccountCount} child accounts.
    Current balance: ${currentWib} WIB
    Required balance: ${requiredWib} WIB
    `);
  }
  if (insufficientEth) {
    logger.error(`
    Root Buyer (${rootBuyerAddress}) does not have enough ETH to fund ${childAccountCount} child accounts.
    Current balance: ${currentGwei} GWei
    Required balance: ${requiredGwei} GWei
    (The required balance does not take into account transaction costs)
    `);
  }

  if (insufficientWib || insufficientEth) {
    process.exit(1);
  }
};

const server = () => {
  checkConfig(config);
  checkFunds();

  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Buyer API listening on port ${port} and host ${host} in ${env} mode`));

  attachContractEventSubscribers(contractEventSubscribers, app.locals.stores);
};

export default server;
