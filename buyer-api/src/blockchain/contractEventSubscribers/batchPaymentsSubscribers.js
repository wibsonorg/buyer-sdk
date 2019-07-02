import config from '../../../config';
import { jobify } from '../../utils/jobify';
import { BatPay, decodeLogs, fetchTxData } from '../contracts';
import web3 from '../../utils/web3';
import { orderStats } from '../../utils/stores';

const { batPayId } = config;

export const updateBuyerStats = async ({ payIndex, from, totalNumberOfPayees }) => {
  if (batPayId !== Number(from)) return; // We didn't perform this payment
  const { metadata: dxHash } = await BatPay.methods.payments(payIndex).call();
  const { gasPrice } = await web3.eth.getTransaction(dxHash);
  const { gasUsed, logs } = await web3.eth.getTransactionReceipt(dxHash);
  const ethUsed = Number(gasPrice) * Number(gasUsed);
  const { orderId } = await decodeLogs(logs);
  orderStats.update(Number(orderId), [{
    ethSpent: ethUsed,
    amountOfPayees: Number(totalNumberOfPayees),
  }], []);
};

export const onPaymentRegistered = jobify(updateBuyerStats);

/**
 * @typedef PaymentUnlockedEventValues
 * @property {string} buyer The buyer that created the DataOrder
 * @callback onPaymentUnlocked Is triggered when the payment to the seller is unlocked
 * @param {UnlockEventValues} eventValues The values emmited by the BatPay PaymentUnlocked event
 */
export const onPaymentUnlocked = async ({ payIndex, key: masterKey }, { transactionHash }) => {
  // unlock handler
  // get order id and seller id
  // get seller's key from level (notarizations)
  const txInput = await fetchTxData({ transactionHash });
  console.log({ payIndex, masterKey, txInput });

  // decrypt key with masterKey
  // using decryptionKeyEncryptedWithMasterKey
  // get data from s3
  // decrypt data
  // append data to s3
  // store email to level?
};
