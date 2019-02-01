// TODO: DEPRECATED This should be removed in favor of src/utils/blockchain.js
/**
 * @function getElements
 * @param {Object} contract the instance of the truffle contract to consult.
 * @param {String} property The property name to get the list from.
 * @returns {Array} An array of elements stored in the property.
 */
const getElements = async (contract, property, _idx, _elements) => {
  if (!contract) throw new Error('Contract must exist');

  const idx = _idx || 0;
  const elements = _elements || [];

  try {
    const element = await contract.methods[property](idx).call();
    if (!element || element === '0x') {
      throw new Error('Deployed version compatible: No more elements');
    }
    return getElements(contract, property, idx + 1, [...elements, element]);
  } catch (err) {
    return elements;
  }
};

export { getElements }; // eslint-disable-line import/prefer-default-export
