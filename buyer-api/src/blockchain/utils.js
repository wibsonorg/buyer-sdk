export const toDate = ts => (ts > 0 ? new Date(ts * 1000).toISOString() : null);

/**
 * @function getElements
 * @param {Object} contract the instance of the truffle contract to consult.
 * @param {String} property The property name to get the list from.
 * @returns {Array} An array of elements stored in the property.
 */
export const getElements = async (contract, property, start = 0) => {
  if (!contract) throw new Error('Contract must exist');
  const elements = [];
  const getElement = i => contract.methods[property](i).call();
  try {
    let e = await getElement(0);
    for (let i = start; e && e !== '0x'; i += 1) {
      /* eslint-disable no-await-in-loop */
      elements.push(e);
      e = await getElement(i);
    }
  } catch (_) { /**/ }
  return elements;
};
