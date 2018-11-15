import { logger, dataExchange } from '../utils';
import { eventBlocks } from '../utils/stores';

const invokeSubscribers = async (subscribers, result, stores) => {
  const invocableSubscribers = subscribers.filter(subscriber =>
    subscriber.events.includes(result.event));

  invocableSubscribers.forEach((subscriber) => {
    logger.info(`Contract Events :: Invoking subscriber '${subscriber.name}' :: Event '${result.event}'`);
    subscriber.callback(result, stores);
  });
};

const attachContractEventSubscribers = async (
  subscribers,
  stores,
  startingBlock,
) => {
  let fromBlock;
  try {
    fromBlock = Number(await eventBlocks.get('last_processed_block')) + 1;
  } catch (err) {
    fromBlock = startingBlock;
  }

  logger.info(`Contract Events :: From block :: ${fromBlock}`);
  const events = await dataExchange.getPastEvents('allEvents', { fromBlock });
  const confirmedEvents = events.filter(result => Number(result.blockNumber) > 0);

  if (confirmedEvents.length > 0) {
    const blockNumbers = confirmedEvents.map(result => result.blockNumber);
    const lastProcessedBlock = Math.max(...blockNumbers);
    await eventBlocks.put('last_processed_block', lastProcessedBlock);
    logger.info(`Contract Events :: Last processed block :: ${lastProcessedBlock}`);

    confirmedEvents.forEach((result) => {
      logger.debug(`Contract Events :: Received :: Event '${result.event}'`);
      invokeSubscribers(subscribers, result, stores);
    });
  } else {
    logger.info('Contract Events :: No events to process');
  }
};

export default attachContractEventSubscribers;
