const partition = (collection, partitionFunc) => {
  let left = [];
  let right = [];

  collection.forEach((item) => {
    if (partitionFunc(item)) {
      left = [...left, item];
    } else {
      right = [...right, item];
    }
  });

  return [left, right];
};

/**
 * @typedef PromisifyOptions
 * @property {function} catchCallback it is called for every caught promise.
 * @property {boolean} removeRejected Flag indicating if rejected are removed of the array resolved.
 *
 * @function promisify
 * @param {Array<Promise>} promises Array of promises to resolve in one.
 * @param {PromisifyOptions} options Options to configure behaviour.
 * @returns {Promise<Array>} Promise that resolves to the array of the promises results.
 */
const promisify = async (promises, { catchCallback, removeRejected } = {}) => {
  const { catchCallback, removeRejected } = options || {};

  const caughtPromises = promises.map(prom =>
    prom.catch(error => (catchCallback ? catchCallback(error) : { error })));

  const resolvedPromises = await Promise.all(caughtPromises);

  return removeRejected ? resolvedPromises.filter(p => !p.error) : resolvedPromises;
};

export { partition, promisify };
