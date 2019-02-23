import { BigNumber } from "bignumber.js";
import { getAccount } from "../services/signingService";
import { hasEnoughBatPayBalance } from "../blockchain/balance";
import { addTransactionJob } from "../queues/transactionQueue";
import { logger } from "../utils";
import config from "../../config";
import { BatPay } from "../blockchain/contracts";

const {
  balance: { minBatPay },
  checkBatPayBalance: { interval, multiplier },
} = config

export const checkBatPayBalance = async () => {
  const account = await getAccount();
  const hasEnough = await hasEnoughBatPayBalance(account);
  if (!hasEnough) {
    const required = new BigNumber(minBatPay);
    const amount = required.multipliedBy(multiplier);
    await addTransactionJob('IncreaseApproval', {
      _spender: BatPay.options.address,
      _addedValue: amount,
    });
    logger.info('BatPay Balance Check :: Deposit requested');
  } else {
    logger.info('BatPay Balance Check :: No deposit needed');
  }
}

export const runCheckBatPayBalance = () =>
  setInterval(checkBatPayBalance, interval);
