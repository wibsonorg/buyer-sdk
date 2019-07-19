import { contractEventListener } from '../contractEventListener';
import { DataExchange, Wibcoin, BatPay } from '../contracts';
import { onDataOrderCreatedJob, onDataOrderClosedJob } from './dataOrderSubscribers';
import { onNotaryRegistered, onNotaryUpdated, onNotaryUnregistered } from './notariesSubscribers';
import { updateBuyerStats, decryptSellerKeys, storeLockingKeyHashByPayIndex, updateCurrentPaymentsAmount } from './batchPaymentsSubscribers';
import { sendDepositJob } from '../../recurrent/checkBatPayBalance';
import { jobify } from '../../utils/jobify';


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
  .on('PaymentRegistered', jobify(updateBuyerStats))
  .on('PaymentRegistered', jobify(storeLockingKeyHashByPayIndex))
  .on('PaymentRegistered', jobify(updateCurrentPaymentsAmount))
  .on('PaymentUnlocked', jobify(decryptSellerKeys));

export { contractEventListener };
