import { web3, wibcoin } from '.';
import config from '../../config';

const checkRootBuyerFunds = () => {
  const childAccountCount = getChildAccounts.count
  const wibBalance = wibcoin.balanceOf.call(buyerRootAddress);
  const gweiBalance = web3.eth.getBalance(buyerRootAddress);

  const requiredWib = childAccountCount * config.buyerChild.minWib;
  const requiredGwei = childAccountCount * config.buyerChild.minGwei;

  return {
    rootBuyerAddress,
    currentWib,
    requiredWib,
    currentGwei,
    requiredGwei,
  };
};
