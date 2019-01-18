import attachContractEventSubscribers from './attachContractEventSubscribers';
import cacheUpdaterSubscriber from './cacheUpdaterSubscriber';
import buyDataSubscriber from './buyDataSubscriber';

const subscribers = [
  cacheUpdaterSubscriber,
  buyDataSubscriber,
];

export default (stores, lastProcessedBlock) => {
  attachContractEventSubscribers(subscribers, stores, lastProcessedBlock);
};
