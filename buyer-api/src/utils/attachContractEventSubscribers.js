import { logger, dataExchange } from '.';

const attachContractEventSubscribers = async (subscribers, stores) => {
  subscribers.forEach(subscriber =>
    logger.info(`Contract Events :: Subscribing '${subscriber.name}'`));

  const events = dataExchange.allEvents();
  events.watch((error, result) => {
    if (!error) {
      subscribers.forEach((subscriber) => {
        if (subscriber.events.includes(result.event)) {
          logger.info(`Contract Events :: Invoking subscriber '${subscriber.name}' :: Event '${result.event}'`);
          subscriber.callback(result, stores);
        } else {
          logger.info(`Contract Events :: Skipping '${subscriber.name}' :: Event '${result.event}'`);
        }
      });
    } else {
      logger.error(`Contract Events :: Error :: ${error}`);
    }
  });
};

export default attachContractEventSubscribers;
