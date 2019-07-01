import td from 'testdouble';
import sinon from 'sinon';

export const { BatPay } = td.replace('../../../src/blockchain/contracts', {
  BatPay: sinon.spy(),
});

