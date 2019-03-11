import '@babel/polyfill';
import app from './app';
import config from '../config';
import { logger } from './utils';
import { contractEventListener } from './blockchain/contractEventSubscribers';
import './recurrent';

const server = () => {
  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Buyer API listening on port ${port} and host ${host} in ${env} mode`));
  contractEventListener.listen();
};

export default server;
