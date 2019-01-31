import { listenContractEvents as listen } from './listenContractEvents';
import { dataOrderCacheSubscriber } from './dataOrderSubscriber';
import { notarySubscriber } from './notarySubscriber';

export const listenContractEvents = () => listen(
  dataOrderCacheSubscriber,
  notarySubscriber,
);
