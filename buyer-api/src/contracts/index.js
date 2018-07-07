import TruffleContract from 'truffle-contract';

import DataTokenContract from './definitions/Wibcoin.json';
import DataExchangeContract from './definitions/DataExchange.json';
import DataOrderContract from './definitions/DataOrder.json';

let dataToken = null;
let dataExchange = null;
let dataOrderContract = null;

/**
 * @function getContract
 * @param {Object} web3 the web3 object.
 * @param {String} contractDefinition the contract definition in json format.
 * @returns {Object} A representation of the contract configured with current web3 provider.
 */
const getContract = (web3, contractDefinition) => {
  const contract = TruffleContract(contractDefinition);
  contract.setProvider(web3.currentProvider);

  // @TODO: Dirty hack to support web3@1.0.0 in truffle. Take it out when there is
  // official support. @see {@link https://github.com/trufflesuite/truffle-contract/issues/56}
  contract.currentProvider.sendAsync = () => contract.currentProvider.send(...arguments);

  return contract;
};

/**
 * @async
 * @function getContracts
 * @param {Object} web3 the web3 object
 * @param {String} dataTokenAddress the ethereum address to the data token used.
 * @param {String} dataExchangeAddress the ethereum address to the data exchange used.
 * @throws When truffle can not instantiate the contracts at the given addresses.
 * @returns {Promise} Promise which resolves to an instance of the data token and
 * the data exchange, and the configured data order truffle contract.
 */
const getContracts = async (web3, dataTokenAddress, dataExchangeAddress) => {
  if (!dataToken && dataTokenAddress) {
    const dataTokenContract = getContract(web3, DataTokenContract);
    dataToken = await dataTokenContract.at(dataTokenAddress);
  }

  if (!dataExchange && dataExchangeAddress) {
    const dataExchangeContract = getContract(web3, DataExchangeContract);
    dataExchange = await dataExchangeContract.at(dataExchangeAddress);
  }

  dataOrderContract = dataOrderContract || getContract(web3, DataOrderContract);

  return {
    dataToken,
    dataExchange,
    dataOrderContract,
  };
};

export default getContracts;
