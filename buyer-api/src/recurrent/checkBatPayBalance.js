import { BigNumber } from "bignumber.js";
import { getAccount } from "../services/signingService";
import { hasEnoughBatPayBalance } from "../blockchain/balance";
import { addTransactionJob } from "../queues/transactionQueue";
import { logger } from "../utils";
import config from "../../config";

const {
  balance: { minBatPay },
  checkBatPayBalance: { interval, multiplier },
} = config

export const checkBatPayBalance = async () => {
  const account = await getAccount();
  const hasEnough = await hasEnoughBatPayBalance(account);
  if (!hasEnough) {
    const required = new BigNumber(minBatPay);
    // addTransactionJob('Deposit', {
    //   amount: required.multipliedBy(multiplier),
    //   id: account.id
    // });
    console.log('Deposit', {
      amount: required.multipliedBy(multiplier),
      id: account.id
    });
    logger.info('BatPay Balance Check :: Deposit requested');
  } else {
    logger.info('BatPay Balance Check :: No deposit needed');
  }
}

setInterval(checkBatPayBalance, interval);
