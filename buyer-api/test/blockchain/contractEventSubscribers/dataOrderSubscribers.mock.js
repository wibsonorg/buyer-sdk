import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const dataOrders = { update: sinon.spy(), store: sinon.spy(), fetch: sinon.stub() };
td.replace('../../../src/utils/stores', { dataOrders });
export const fetchDataOrder = sinon.stub();
td.replace('../../../src/blockchain/dataOrder', { fetchDataOrder });
export const getAccount = sinon.stub();
td.replace('../../../src/services/signingService', { getAccount });

export const DataExchange = sinon.spy();
export const WIBToken = sinon.spy();
td.replace('../../../src/blockchain/contracts', { DataExchange, WIBToken });
export const sendDeposit = sinon.spy();
td.replace('../../../src/recurrent/checkBatPayBalance', { sendDeposit });

test.afterEach(sinon.reset);
