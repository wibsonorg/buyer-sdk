import { expect } from 'chai';
import { toBN, transferParams } from '../../src/facades/transferFacade';

describe.only('transferFacade', () => {
  describe('#transferParams', () => {
    const subject = (balance, min = toBN(10), max = toBN(20)) =>
      transferParams('0x1234', balance, { min, max });

    it('returns false when balance is within ranges', () => {
      expect(subject(toBN(15))).to.be.false;
    });

    it('returns with the corresponding params when balance is below the minimum', () => {
      expect(subject(toBN(9))).to.eql({
        _to: '0x1234',
        _value: '11',
      });
    });
  });
});
