/* eslint-disable no-restricted-globals */
import R from 'ramda';
import { BatPay, getElements } from '../blockchain/contracts';
import logger from '../utils/logger';
import web3 from '../utils/web3';

const mapWithIndex = R.addIndex(R.map);

const logPayment = (payment) => {
  logger.info(`\n\nPayment #${payment.payIndex}`);
  R.forEachObjIndexed(
    (value, key) => isNaN(Number(key)) && logger.info(`${key}: ${value}`),
    payment,
  );
};

export default async () => {
  logger.info('Getting payments...');
  const payments = await getElements(BatPay, 'payments');
  logger.info('Getting latest block number...');
  const latestBlock = await web3.eth.getBlockNumber();

  const paymentsToRefund = R.pipe(
    mapWithIndex((payment, idx) => ({ ...payment, payIndex: idx - 1 })),
    R.reject(R.anyPass([
      R.propEq('amount', '0'),
      R.propEq(
        'lockingKeyHash',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ),
      R.propSatisfies(timeout => Number(timeout) > Number(latestBlock), 'lockTimeoutBlockNumber'),
    ])),
  )(payments);

  R.forEach(logPayment, paymentsToRefund);

  R.pipe(
    R.groupBy(R.prop('fromAccountId')),
    R.mapObjIndexed(group => R.pluck('payIndex', group)),
    R.mapObjIndexed((payIndexes, buyerId) => logger.info(`${buyerId}: ${payIndexes}`)),
  )(paymentsToRefund);

  const totalPayees = R.pipe(
    R.pluck('totalNumberOfPayees'),
    R.sum,
  )(paymentsToRefund);

  logger.info(`Total Payees: ${totalPayees}`);
};
