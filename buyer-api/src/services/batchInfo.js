import uuid from 'uuid/v4';
import { createLevelStore, listLevelKeys, listLevelPairs } from '../utils';
import config from '../../config';

const ordersPerBatch =
  createLevelStore(`${config.levelDirectory}/orders_per_batch`);

/**
 * @async
 * @function listBatchIds
 * @returns {Promise} Promise which resolves to a list of batch Ids.
 */
const listBatchIds = async () => listLevelKeys(ordersPerBatch);

/**
 * @async
 * @function listBatchPairs
 * @returns {Promise} Promise which resolves to a list of batches.
 */
const listBatchPairs = async () => listLevelPairs(ordersPerBatch);

/**
 * @function createBatchId
 * @param {String} orderAddresses initial orders if apply
 * @returns {String} A new Id for the batch of orders
 */
const createBatch = async (orderAddresses = []) => {
  const id = uuid();
  const newBatch = { status: 'open', orderAddresses };
  await ordersPerBatch.put(id, JSON.stringify(newBatch));
  return id;
};

/**
 * @function startClosingOfBatch
 * @param {String} batchId a uuid
 * @returns {Promise} true if it started successfully
 */
const startClosingOfBatch = async (batchId) => {
  const batch = await ordersPerBatch.get(batchId);
  if (batch) {
    const { orderAddresses } = JSON.parse(batch);
    const updatedBatch = { status: 'closing', orderAddresses };
    await ordersPerBatch.put(batchId, JSON.stringify(updatedBatch));
    return true;
  }
  return false;
};

/**
 * @function closeBatch
 * @param {String} batchId a uuid
 * @returns {Promise} true if closed successfully
 */
const closeBatch = async (batchId) => {
  const batch = await ordersPerBatch.get(batchId);
  if (batch) {
    const { orderAddresses } = JSON.parse(batch);
    const newBatch = { status: 'closed', orderAddresses };
    await ordersPerBatch.put(batchId, JSON.stringify(newBatch));
    return true;
  }
  return false;
};

/**
 * @async
 * @function associateOrderToBatch
 * @description Associates an order address with a batch.
 * @param {String} batchId a timestamp
 * @param {String} orderAddress the ethereum address for the Data Order
 * @returns {Promise} Promise which carries out the association
 */
const associateOrderToBatch = async (batchId, orderAddress) => {
  try {
    if (orderAddress) {
      const raw = await ordersPerBatch.get(batchId);
      const { status, orderAddresses } = JSON.parse(raw);
      await ordersPerBatch.put(
        batchId,
        JSON.stringify({ status, orderAddresses: orderAddresses.concat(orderAddress) }),
      );
    }
  } catch (err) {
    if (err.notFound) {
      await ordersPerBatch.put(
        batchId,
        JSON.stringify({ status: 'open', orderAddresses: [orderAddress] }),
      );
    } else { throw err; }
  }
};

/**
 * @async
 * @function getBatchInfo
 * @description Gets stored batch info for a given batchId
 * @param {String} batchId a uuid
 * @throws When there is no data for that batchId.
 * @returns {Promise} Promise which resolves to the buyer info of that Data Order.
 */
const getBatchInfo = async (batchId) => {
  const batch = await ordersPerBatch.get(batchId);
  return JSON.parse(batch);
};

export {
  listBatchIds,
  listBatchPairs,
  createBatch,
  associateOrderToBatch,
  getBatchInfo,
  closeBatch,
  startClosingOfBatch,
};
