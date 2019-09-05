import { EventEmitter } from 'events';
import { eventBlocks } from '../utils/stores';
import { logger, web3 } from '../utils';
import config from '../../config';

const { lastProcessedBlock, interval } = config.contractEventListener;
export const contractEventListener = new EventEmitter();

const contracts = [];
const processEvents = () =>
  eventBlocks.update('last_processed_block', async (lastBlock = lastProcessedBlock) => {
    const fromBlock = Number(lastBlock) + 1;
    const toBlock = await web3.eth.getBlockNumber();
    logger.debug(`Contract Events :: Blocks ${fromBlock} to ${toBlock}`);

    const allEvents = contracts.map(c => c.getPastEvents('allEvents', { fromBlock, toBlock }));
    const confirmedEvents = (await Promise.all(allEvents))
      .reduce((acc, val) => acc.concat(val), [])
      .filter(result => Number(result.blockNumber) > 0);

    logger.debug(`Contract Events :: Events to process :: ${confirmedEvents.length}`);

    const proccessData = { fromBlock, toBlock, events: confirmedEvents };
    // Pre-announce events
    contractEventListener.emit('ProcessingEvents', proccessData);

    // Announce each event
    confirmedEvents.forEach((e) => {
      logger.info(`Contract Events :: Processing Event :: '${e.event}'`);
      contractEventListener.emit(e.event, e.returnValues, e);
    });

    // Announce that all events were announced
    contractEventListener.emit('EventsProcessed', proccessData);

    // Avoid polluting production logs
    const log = confirmedEvents.length > 0 ? logger.info : logger.debug;
    log(`Contract Events :: Last processed block :: ${toBlock}`);

    return toBlock;
  });

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
