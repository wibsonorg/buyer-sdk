import config from '../../../config';
import { BatPay, decodeLogs, fetchTxData } from '../contracts';
import web3 from '../../utils/web3';
import { orderStats, paymentsTransactionHashes, notarizationsPerLockingKeyHash, notarizations } from '../../utils/stores';

const { batPayId } = config;

export const updateBuyerStats = async (
  { payIndex, from, totalNumberOfPayees }, { transactionHash },
) => {
  if (batPayId !== Number(from)) return; // We didn't perform this payment
  const { metadata: dxHash } = await BatPay.methods.payments(payIndex).call();
  const { logs } = await web3.eth.getTransactionReceipt(dxHash);
  const { gasUsed } = await web3.eth.getTransactionReceipt(transactionHash);
  const { gasPrice } = await web3.eth.getTransaction(transactionHash);
  const ethUsed = Number(gasPrice) * Number(gasUsed);
  const { orderId } = await decodeLogs(logs);
  orderStats.update(Number(orderId), [{
    ethSpent: ethUsed,
    amountOfPayees: Number(totalNumberOfPayees),
  }], []);
};

export const storeLockingKeyHashByPayIndex = async ({ payIndex }, { transactionHash }) =>
  paymentsTransactionHashes.store(payIndex, transactionHash);

/**
 * @function decryptSellerKeys Is triggered when the payment to the seller is unlocked
 * @typedef PaymentUnlockedEventValues
 * @property {string} buyer The buyer that created the DataOrder
 * @param {UnlockEventValues} eventValues The values emmited by the BatPay PaymentUnlocked event
 */
export const decryptSellerKeys = async ({ payIndex, key: masterKey }) => {
  // get trx hash from payIndex
  const transactionHash = await paymentsTransactionHashes.fetch(payIndex);
  const { lockingKeyHash } = await fetchTxData(transactionHash);
  const notarizationId = await notarizationsPerLockingKeyHash.fetch(lockingKeyHash);
  const notarization = await notarizations.fetch(notarizationId);
  notarizations.update(notarizationId, {
    masterKey,
  });
  // enqueue notarizatioId
  console.log(notarization);
  // remove notarization ?
};
