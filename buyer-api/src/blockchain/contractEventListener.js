import { EventEmitter } from 'events';
import { eventBlocks } from '../utils/stores';
import { logger } from '../utils';
import config from '../../config';

const { lastProcessedBlock, interval } = config.contractEventListener;
export const contractEventListener = new EventEmitter();

const contracts = [];
const processEvents = async () => {
  // getStartingBlock
  const fromBlock = await eventBlocks.get('last_processed_block')
    .then(lastBlock => Number(lastBlock) + 1)
    .catch(() => lastProcessedBlock);
  logger.debug(`Contract Events :: From block :: ${fromBlock}`);
  // getEvents
  const allEvents = contracts.map(c => c.getPastEvents('allEvents', { fromBlock }));
  const events = (await Promise.all(allEvents))
    .reduce((acc, val) => acc.concat(val), []) // Flatten events from all contracts
    .filter(result => Number(result.blockNumber) > 0); // Confirmed events
  // emitEvents
  events.forEach((e) => {
    logger.info(`Contract Events :: Processing Event :: '${e.event}'`);
    contractEventListener.emit(e.event, e.returnValues, e);
  });
  // saveLastProcessedBlock
  const lastBlock = Math.max(lastProcessedBlock, ...events.map(e => e.blockNumber));
  eventBlocks.put('last_processed_block', lastBlock);
  logger.info(`Contract Events :: Last processed block :: ${lastBlock}`);
};

Object.assign(contractEventListener, {
  addContract(contract) {
    if (!contracts.find(c => c === contract)) {
      contracts.push(contract);
    }
    return contractEventListener;
  },
  listen() {
    setInterval(processEvents, interval);
    processEvents();
  },
});
