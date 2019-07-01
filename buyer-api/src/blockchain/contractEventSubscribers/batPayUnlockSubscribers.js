import { fetchTxData } from '../contracts';

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

