import 'babel-polyfill';
import app from './app';
import config from '../config';
import logger from './utils/logger';

const server = () => {
  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Buyer Signing Service listening on port ${port} and host ${host} in ${env} mode`));
};

export default server;
