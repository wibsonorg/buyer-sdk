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

const checkFunds = async () => {
  const {
    rootBuyerAddress,
    childrenCount,
    currentWib,
    requiredWib,
    currentWei,
    requiredWei,
  } = await rootBuyerFunds();

  const insufficientWib = currentWib.isLessThan(requiredWib);
  const insufficientEth = currentWei.isLessThan(requiredWei);

  if (insufficientWib) {
    logger.error(`
    Root Buyer (${rootBuyerAddress}) does not have enough WIB to fund ${childrenCount} child accounts.
    Current balance: ${currentWib} WIB
    Required balance: ${requiredWib} WIB
    `);
  }
  if (insufficientEth) {
    logger.error(`
    Root Buyer (${rootBuyerAddress}) does not have enough ETH to fund ${childrenCount} child accounts.
    Current balance: ${currentWei} Wei
    Required balance: ${requiredWei} Wei
    (The required balance does not take into account transaction costs)
    `);
  }

  if (insufficientWib || insufficientEth) {
    process.exit(1);
  }
};

const server = async () => {
  checkConfig(config);
  await checkFunds();

  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Buyer API listening on port ${port} and host ${host} in ${env} mode`));

  attachContractEventSubscribers(contractEventSubscribers, app.locals.stores);
};

export default server;
