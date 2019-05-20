import { contractEventListener } from '../contractEventListener';
import { DataExchange, Wibcoin } from '../contracts';
import { onDataOrderCreatedJob, onDataOrderClosedJob } from './dataOrderSubscribers';
import { onNotaryRegistered, onNotaryUpdated, onNotaryUnregistered } from './notariesSubscribers';
import { sendDepositJob } from '../../recurrent/checkBatPayBalance';


contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', onDataOrderCreatedJob)
  .on('DataOrderClosed', onDataOrderClosedJob)
  .on('NotaryRegistered', onNotaryRegistered)
  .on('NotaryUpdated', onNotaryUpdated)
  .on('NotaryUnregistered', onNotaryUnregistered)
  .addContract(Wibcoin)
  .on('Approval', sendDepositJob);

export { contractEventListener };
