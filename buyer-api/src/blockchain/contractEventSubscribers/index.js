import { contractEventListener } from '../contractEventListener';
import { DataExchange, Wibcoin } from '../contracts';
import { onDataOrderCreated, onDataOrderClosed } from './dataOrderSubscribers';
import { sendDeposit } from '../../recurrent/checkBatPayBalance';


contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', onDataOrderCreated)
  .on('DataOrderClosed', onDataOrderClosed)
  .addContract(Wibcoin)
  .on('Approval', sendDeposit);

export { contractEventListener };
