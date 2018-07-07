import TruffleContract from 'truffle-contract';

import DataTokenContract from './abis/Wibcoin.json';
import DataExchangeContract from './abis/DataExchange.json';
import DataOrderContract from './abis/DataOrder.json';

let dataTokenContractInstance = null;
let dataExchangeContractInstance = null;
let dataOrderContract = null;

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
  if (dataTokenContractInstance && dataExchangeContractInstance && dataOrderContract) {
    return {
      dataTokenContractInstance,
      dataExchangeContractInstance,
      dataOrderContract,
    };
  }

  const dataTokenContract = TruffleContract(DataTokenContract);
  const dataExchangeContract = TruffleContract(DataExchangeContract);
  dataOrderContract = TruffleContract(DataOrderContract);

  dataTokenContract.setProvider(web3.currentProvider);
  dataExchangeContract.setProvider(web3.currentProvider);
  dataOrderContract.setProvider(web3.currentProvider);

  // @TODO: Dirty hack to support web3@1.0.0 in truffle. Take it out when there is
  // official support. @see {@link https://github.com/trufflesuite/truffle-contract/issues/56}
  dataTokenContract.currentProvider.sendAsync = () =>
    dataTokenContract.currentProvider.send(...arguments);

  dataExchangeContract.currentProvider.sendAsync = () =>
    dataExchangeContract.currentProvider.send(...arguments);

  dataOrderContract.currentProvider.sendAsync = () =>
    dataOrderContract.currentProvider.send(...arguments);
  // ---

  [dataTokenContractInstance, dataExchangeContractInstance] = await Promise.all([
    dataTokenContract.at(dataTokenAddress),
    dataExchangeContract.at(dataExchangeAddress),
  ]);

  return {
    dataTokenContractInstance,
    dataExchangeContractInstance,
    dataOrderContract,
  };
};

export default getContracts;
