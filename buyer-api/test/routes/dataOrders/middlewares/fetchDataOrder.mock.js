import td from 'testdouble';
import sinon from 'sinon';

export const res = { boom: { notFound: sinon.spy() } };
export const next = sinon.spy();
export const dataOrders = { fetch: sinon.stub().returns({ status: 'created' }) };
td.replace('../../../../src/utils/stores', { dataOrders });
