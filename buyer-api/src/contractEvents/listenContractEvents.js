import config from '../../config';
import { logger } from '../utils';
import { fetchDataExchangeEvents } from '../utils/blockchain';
import { eventBlocks } from '../utils/stores';

const { lastProcessedBlock, interval } = config.eventSubscribers;

const createContractEventListener = (...subscribers) => async () => {
  let fromBlock;
  try {
    fromBlock = (await eventBlocks.fetch('last_processed_block')) + 1;
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
  await eventBlocks.store('last_processed_block', lastBlock);
  logger.info(`Contract Events :: Last processed block :: ${lastBlock}`);
  events.forEach(({ event, returnValues }) => {
    logger.info(`Contract Events :: Received :: Event '${event}'`);
    subscribers.forEach((subscriber) => {
      const callback = subscriber[event];
      if (callback) {
        logger.info(`Contract Events :: Invoking subscriber '${subscriber.name}' :: Event '${event}'`);
        callback(returnValues);
      }
    });
  });
};

export const listenContractEvents = (...subscribers) => {
  const listen = createContractEventListener(...subscribers);
  setInterval(listen, interval);
  listen();
};
