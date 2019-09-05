import '@babel/polyfill';
import app from './app';
import config from '../config';
import { logger } from './utils';
import { contractEventListener } from './blockchain/contractEventSubscribers';
import './recurrent';

const checkConfig = (conf) => {
  let error = false;
  const traverse = (o, p) => {
    Object.entries(o).forEach(([k, v]) => {
      const keyName = p ? `${p}.${k}` : k;
      if (v === undefined) {
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

const server = () => {
  checkConfig(config);
  const { app: { name }, port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`${name} listening on port ${port} and host ${host} in ${env} mode`));
  contractEventListener.listen();
};

export default server;
