import { BigNumber } from 'bignumber.js';
import { web3, wibcoin } from '.';
import config from '../../config';
import signingService from '../services/signingService';
import { coin } from '../utils/wibson-lib';

const rootBuyerFunds = async () => {
  const { root, children } = await signingService.getAccounts();

  const childrenCount = BigNumber(children.length);
  const currentWibUnits = await wibcoin.balanceOf.call(root.address);
  const currentWib = BigNumber(coin.toWib(currentWibUnits));

  const currentWeiBalance = await web3.eth.getBalance(root.address);
  const currentWei = BigNumber(currentWeiBalance);

  const requiredWib = childrenCount.times(BigNumber(config.buyerChild.minWib));
  const requiredWei = childrenCount.times(BigNumber(config.buyerChild.minWei));

  return {
    rootBuyerAddress: root.address,
    childrenCount,
    currentWib,
    requiredWib,
    currentWei,
    requiredWei,
  };
};

export { rootBuyerFunds };
