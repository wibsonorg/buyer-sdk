import { BigNumber } from 'bignumber.js';
import { getAccount } from '../services/signingService';
import {
  hasEnoughBatPayBalance,
  hasBatPayEnoughTokenAllowance,
} from '../blockchain/balance';
import { addTransactionJob } from '../queues/transactionQueue';
import logger from '../utils/logger';
import config from '../../config';
import { BatPay } from '../blockchain/contracts';

const {
  balance: { minBatPay },
  checkBatPayBalance: { interval, multiplier },
} = config;

/**
 * @async
 * @function checkBatPayBalance
 *  Checks if Buyer account has enough balance in BatPay.
 *  If there is not enough balance, it adds a job to increase BatPay's allowance.
 *  The process continues with the `sendDeposit` function when the `Approval` event
 *  arrives.
 *
 *  See `sendDeposit` and `contractEventSubscribers` module for more information.
 */
export const checkBatPayBalance = async () => {
  const account = await getAccount();
  const enoughBalance = await hasEnoughBatPayBalance(account);
  if (!enoughBalance) {
    const required = new BigNumber(minBatPay);
    const amount = required.multipliedBy(multiplier);

    const enoughAllowance = await hasBatPayEnoughTokenAllowance(account);
    if (!enoughAllowance) {
      await addTransactionJob('IncreaseApproval', {
        _spender: BatPay.options.address,
        _addedValue: amount,
      });
      logger.info('BatPay Balance Check :: Allowance increase requested');
    } else {
      await addTransactionJob('Deposit', { amount });
      logger.info('BatPay Balance Check :: Deposit requested');
    }
  } else {
    logger.info('BatPay Balance Check :: No deposit needed');
  }
};

/**
 * @typedef ApprovalEvent
 * @property {string} owner Ethereum's address of wallet owner
 * @property {string} spender Ethereum's address of the spender
 * @property {string} value Amount of tokens approved in the transaction
 *
 * @async
 * @function sendDeposit
 *  This is the handler for the `Approval` event.
 *  It issues a Deposit transaction that will allow the Buyer account to operate
 *  with the BatPay contract.
 * @param {ApprovalEvent} event
 */
export const sendDeposit = async (event) => {
  const { owner, spender, value: amount } = event;
  const account = await getAccount();
  if (account.address.toLowerCase() !== owner.toLowerCase()) return;
  if (spender.toLowerCase() !== BatPay.options.address.toLowerCase()) return;

  const enoughBalance = await hasEnoughBatPayBalance(account);
  if (!enoughBalance) {
    await addTransactionJob('Deposit', { amount });
    logger.info('BatPay Balance Check :: Deposit requested');
  }
};

export const runCheckBatPayBalance = () =>
  setInterval(checkBatPayBalance, interval);
