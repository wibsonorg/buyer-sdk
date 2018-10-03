/**
 * @function dateOrNull
 * @param {Number} timestamp The timestamp in seconds.
 * @returns {String} The ISO string representation of the date or null if the
 * timestamp was undefined or zero
 */
const dateOrNull = (timestamp) => {
  if (typeof timestamp !== 'undefined' && timestamp > 0) {
    return new Date(timestamp * 1000).toISOString();
  }
  return null;
};

export { dateOrNull }; // eslint-disable-line import/prefer-default-export
