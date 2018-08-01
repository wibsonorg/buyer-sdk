import 'babel-polyfill';
import app from './app';
import config from '../config';
import subscribers from './subscribers';
import { logger, attachContractEventSubscribers } from './utils';

const { port, host, env } = config;
app.listen({ port, host }, () =>
  logger.info(`Buyer API listening on port ${port} and host ${host} in ${env} mode`));

attachContractEventSubscribers(subscribers, app.locals.stores);
