import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const sellers = { safeFetch: sinon.stub(), put: sinon.spy() };
td.replace('../../src/utils/stores', { sellers });

test.beforeEach(() => {
  sellers.safeFetch.withArgs('2').returns(3);
});
test.afterEach(sinon.reset);
