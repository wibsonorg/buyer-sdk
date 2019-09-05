require('@babel/polyfill');
const loadEnv = require('../utils/wibson-lib/loadEnv').default;

loadEnv();

const {
  // REMOVE
  //   notariesCache, // UNUSED
  //   notarizationRequests, // UNUSED
  // IGNORE (not related)
  //   dataOrdersByDxId,
  //   dataOrders,
  //   notaries,
  //   eventBlocks,
  //   buyerInfos,
  //   buyerInfoPerOrder,
  // KEEP
  //   orderStats, // WE NEED THESE FOR THE BUYER
  //   we will flush these but even if we dont they should work
  //     dataResponses,
  //     dataResponsesAccumulator,
  //     dataResponsesBatches,
  //     dataResponsesLastAdded,
  //     notarizationsPerLockingKeyHash,
  // CLEAR
  sellers, // new BatPay == new ids
  paymentsTransactionHashes, // payIndex is the key
  currentPaymentsAmount, // new BatPay == no pending payments
  // UPDATE
  notarizations, // ['created', 'requested'].includes(n.status) -> { status: 'responded' }
} = require('../utils/stores');
const logger = require('../utils/logger');

async function migrate() {
  logger.info('UPDATE NOTARIZATIONS...');
  const updatedNotarizations = (await Promise.all((await notarizations.list())
    .filter(n => ['created', 'requested'].includes(n.status))
    .map(n => notarizations.update(n.id, {
      status: 'responded', statusReason: 'Status set in migration to BatPay v2.1',
    })))).length;
  logger.info(`UPDATED NOTARIZATIONS ${updatedNotarizations}`);
  logger.info('VERIFYING NOTARIZATIONS...');
  const allNotarizations = await notarizations.list();
  const respondedNotarizations = allNotarizations.filter(a => a.status === 'responded').length;
  logger.info(`RESPONDED NOTARIZATIONS: ${respondedNotarizations}/${allNotarizations.length}`);
  logger.info('CLEAR DBS...');
  const dbsToClear = [
    sellers,
    paymentsTransactionHashes,
    currentPaymentsAmount,
  ];
  const clearDB = async db => db.deleteList(await db.listKeys());
  await Promise.all(dbsToClear.map(clearDB));
  const isEmpty = async db => (await db.listKeys()).length === 0;
  const clearCount = (await Promise.all(dbsToClear.map(isEmpty))).filter(x => x).length;
  logger.info(`DBS CLEARED: ${clearCount}/${dbsToClear.length}`);
  logger.info('END.');
}

migrate().then(() => process.exit());
