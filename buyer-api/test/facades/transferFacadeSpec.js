/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { web3 } from '../../src/utils';
import { checkAndTransfer } from '../../src/facades/transferFacade';

const toBN = num => web3.toBigNumber(num);

describe('transferFacade', () => {
  const child = { number: 0, address: web3.eth.accounts[2] };

  describe('#checkAndTransfer', () => {
    const subject = async (balance, min = toBN(10), max = toBN(20)) =>
      checkAndTransfer(child, () => balance, params => params, min, max);

    it('returns false when balance is above the required minimum', async () => {
      expect(await subject(toBN(10))).to.be.false;
      expect(await subject(toBN(15))).to.be.false;
      expect(await subject(toBN(20))).to.be.false;
      expect(await subject(toBN(30))).to.be.false;
    });

    it('returns a truthy when balance is below the required minimum', async () => {
      expect(subject(toBN(9))).to.not.be.false;
    });
  });
});
