import config from '../../config';
import { logger, fetchDataExchangeEvents } from '../utils';
import { eventBlocks } from '../utils/stores';

const { lastProcessedBlock, interval } = config.eventSubscribers;

const createContractEventListener = (...subscribers) => async () => {
  let fromBlock;
  try {
    fromBlock = Number(await eventBlocks.get('last_processed_block')) + 1;
  } catch (err) {
    fromBlock = lastProcessedBlock;
  }
  const events = await fetchDataExchangeEvents(fromBlock);
  logger.debug(`Contract Events :: From block :: ${fromBlock}`);
  if (events.length === 0) {
    logger.debug('Contract Events :: No events to process');
    return;
  }
  const lastBlock = events
    .map(event => event.blockNumber)
    .reduce((a, b) => Math.max(a, b));
  await eventBlocks.put('last_processed_block', lastBlock);
  logger.info(`Contract Events :: Last processed block :: ${lastBlock}`);
  events.forEach((result) => {
    logger.info(`Contract Events :: Received :: Event '${result.event}'`);
    subscribers
      .filter(subscriber => subscriber.events.includes(result.event))
      .forEach((subscriber) => {
        logger.info(`Contract Events :: Invoking subscriber '${subscriber.name}' :: Event '${result.event}'`);
        subscriber.callback(result);
      });
  });
};

export const listenContractEvents = (...subscribers) => {
  const listen = createContractEventListener(...subscribers);
  setInterval(listen, interval);
  listen();
};
