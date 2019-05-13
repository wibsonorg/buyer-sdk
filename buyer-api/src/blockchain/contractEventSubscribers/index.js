import { contractEventListener } from '../contractEventListener';
import { DataExchange, Wibcoin } from '../contracts';
import { onDataOrderCreated, onDataOrderClosed } from './dataOrderSubscribers';
import { onNotaryRegistered, onNotaryUpdated, onNotaryUnregistered } from './notariesSubscribers';
import { sendDeposit } from '../../recurrent/checkBatPayBalance';


contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', onDataOrderCreated)
  .on('DataOrderClosed', onDataOrderClosed)
  .on('NotaryRegistered', onNotaryRegistered)
  .on('NotaryUpdated', onNotaryUpdated)
  .on('NotaryUnregistered', onNotaryUnregistered)
  .addContract(Wibcoin)
  .on('Approval', sendDeposit);

export { contractEventListener };
