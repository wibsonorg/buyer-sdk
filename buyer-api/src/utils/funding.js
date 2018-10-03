import { web3, wibcoin } from '.';
import config from '../../config';
import signingService from '../services/signingService';

const checkRootBuyerFunds = () => {
  const { root, children } = signingService.getAccounts();

  const childrenCount = children.count;
  const currentWib = wibcoin.balanceOf.call(root);
  const currentGwei = web3.eth.getBalance(root);

  const requiredWib = childrenCount * config.buyerChild.minWib;
  const requiredGwei = childrenCount * config.buyerChild.minGwei;

  return {
    rootBuyerAddress: root,
    childrenCount,
    currentWib,
    requiredWib,
    currentGwei,
    requiredGwei,
  };
};

export { checkRootBuyerFunds };
