import td from 'testdouble';
import sinon from 'sinon';

export const res = { boom: { notFound: sinon.spy() }};
export const next = sinon.spy();
export const fetchDataOrder = (uuid) => {
  if (uuid === 'not-found') throw new Error('Not found');
  return { status: 'created' };
};
td.replace('../../../../src/utils/stores', { fetchDataOrder });
