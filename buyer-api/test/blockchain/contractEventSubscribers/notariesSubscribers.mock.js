import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const notaries = { update: sinon.spy(), fetch: sinon.spy() };
td.replace('../../../src/utils/stores', { notaries });

test.beforeEach(sinon.reset);
