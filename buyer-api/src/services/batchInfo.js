import uuid from 'uuid/v4';
import { createLevelStore, listLevelKeys } from '../utils';
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
 * @function createBatchId
 * @returns {String} A new Id for the batch of orders
 */
// eslint-disable-next-line
const createBatch = async (payload = []) => {
  const id = uuid();
  await ordersPerBatch.put(id, JSON.stringify(payload));
  return id;
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
  let orderAddresses;
  try {
    const raw = await ordersPerBatch.get(batchId);
    orderAddresses = JSON.parse(raw);
    await ordersPerBatch.put(batchId, JSON.stringify(orderAddresses.push(orderAddress)));
  } catch (err) {
    if (err.notFound) {
      await ordersPerBatch.put(batchId, [orderAddress]);
    } else { throw err; }
  }
};

/**
 * @async
 * @function getBatchInfo
 * @description Gets stored batch info for a given batchId
 * @param {String} batchId a timestamp
 * @throws When there is no data for that batchId.
 * @returns {Promise} Promise which resolves to the buyer info of that Data Order.
 */
const getBatchInfo = async (batchId) => {
  const orders = await ordersPerBatch.get(batchId);
  return JSON.parse(orders);
};

export {
  listBatchIds,
  createBatch,
  associateOrderToBatch,
  getBatchInfo,
};
