import config from '../../../config';
import { BatPay, decodeLogs, fetchTxData } from '../contracts';
import web3 from '../../utils/web3';
import { orderStats, paymentsTransactionHashes, notarizationsPerLockingKeyHash, notarizations } from '../../utils/stores';
import { addDecryptJob } from '../../queues/decryptSellerKeys';

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

  await orderStats.update(
    Number(orderId),
    oldStat => ({
      ethSpent: oldStat.ethSpent + ethUsed,
      amountOfPayees: oldStat.amountOfPayees + Number(totalNumberOfPayees),
      paymentsRegistered: oldStat.paymentsRegistered + 1,
    }),
    { ethSpent: 0, amountOfPayees: 0, paymentsRegistered: 0 },
  );
};

/**
 * @function storeLockingKeyHashByPayIndex Is triggered when
 * the payment is registered,
 * storing locally a relationship between the pay index and
 * the payment transaction hash
 * @typedef PaymentRegisteredEventValues
 * @property {number} payIndex Pay index
 *
 * @typedef ExtraEventValues
 * @property {string} transactionHash Pay index
 *
 * @param {PaymentRegisteredEventValues} event
 * @param {ExtraEventValues} eventValues The values emmited by the BatPay PaymentRegistered event
 */
export const storeLockingKeyHashByPayIndex = async ({ payIndex }, { transactionHash }) =>
  paymentsTransactionHashes.store(payIndex, transactionHash);

/**
 * @function decryptSellerKeys Is triggered when the payment to the seller is unlocked

 * @typedef UnlockedEvent
 * @property {number} payIndex Pay index
 * @property {string} key Master key to decrypt seller keys

 * @param {UnlockEventValues} event The values emmited by the BatPay PaymentUnlocked event
 */
export const decryptSellerKeys = async ({ payIndex, key: masterKey }) => {
  const transactionHash = await paymentsTransactionHashes.safeFetch(payIndex, null);
  if (!transactionHash) return; // Not our payment
  const { lockingKeyHash } = await fetchTxData(transactionHash);
  const notarizationId = await notarizationsPerLockingKeyHash.fetch(lockingKeyHash);
  notarizations.update(notarizationId, {
    masterKey,
  });
  addDecryptJob({ notarizationId });
};
