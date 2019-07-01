import { contractEventListener } from '../contractEventListener';
import { DataExchange, Wibcoin, BatPay } from '../contracts';
import { onDataOrderCreatedJob, onDataOrderClosedJob } from './dataOrderSubscribers';
import { onNotaryRegistered, onNotaryUpdated, onNotaryUnregistered } from './notariesSubscribers';
import { sendDepositJob } from '../../recurrent/checkBatPayBalance';
import { onPaymentUnlocked } from './batPayUnlockSubscribers';


contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', onDataOrderCreatedJob)
  .on('DataOrderClosed', onDataOrderClosedJob)
  .on('NotaryRegistered', onNotaryRegistered)
  .on('NotaryUpdated', onNotaryUpdated)
  .on('NotaryUnregistered', onNotaryUnregistered)
  .addContract(Wibcoin)
  .on('Approval', sendDepositJob)
  .addContract(BatPay)
  .on('PaymentUnlocked', onPaymentUnlocked);

export { contractEventListener };
