import TruffleContract from 'truffle-contract';

import DataTokenContract from './abis/Wibcoin.json';
import DataExchangeContract from './abis/DataExchange.json';
import DataOrderContract from './abis/DataOrder.json';

let dataTokenContractInstance = null;
let dataExchangeContractInstance = null;
let dataOrderContract = null;

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

  // TODO: Dirty hack to support web3@1.0.0 in truffle. Take it out when there is
  // official support. See https://github.com/trufflesuite/truffle-contract/issues/56
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
