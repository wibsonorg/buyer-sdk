import td from 'testdouble';
import sinon from 'sinon';

const addContract = { on: sinon.stub(), addContract: sinon.stub() };
addContract.on.returns(addContract);
addContract.addContract.returns(addContract);
export const contractEventListener = { addContract: sinon.stub().returns(addContract) };
td.replace('../../../src/blockchain/contractEventListener', { contractEventListener });
