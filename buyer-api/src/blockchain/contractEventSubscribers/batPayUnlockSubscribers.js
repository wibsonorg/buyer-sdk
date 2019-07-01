/**
 * @callback onPaymentUnlocked Is triggered when the payment to the seller is unlocked
 * @param {UnlockEventValues} eventValues The values emmited by the BatPay PaymentUnlocked event
 */
export const onPaymentUnlocked = async ({ payIndex, key: masterKey }) => {
  // unlock handler
  console.log({ payIndex, masterKey });
  // get seller key from level
  // decrypt data
  // append data to s3
  // store email to level?
};

