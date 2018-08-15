import 'babel-polyfill';
import app from './app';
import config from '../config';
import { logger, attachContractEventSubscribers } from './utils';
import contractEventSubscribers from './contractEventSubscribers';

const { port, host, env } = config;
app.listen({ port, host }, () =>
  logger.info(`Buyer API listening on port ${port} and host ${host} in ${env} mode`));

attachContractEventSubscribers(contractEventSubscribers, app.locals.stores);
