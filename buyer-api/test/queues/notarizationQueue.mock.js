import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

const buyerPublicBaseUrl = 'https://bapi.wibson.org';
td.replace('../../config', { buyerPublicBaseUrl });
td.replace('uuid/v4', () => 'uuid');
export const dataResponses = { fetch: sinon.stub(), store: sinon.spy() };
export const dataResponsesBatches = { fetch: sinon.stub(), store: sinon.spy() };
export const notarizations = {
  fetch: sinon.stub(),
  store: sinon.spy(),
  update: sinon.spy(),
};
export const notaries = { fetch: sinon.stub() };
td.replace('../../src/utils/stores', {
  dataResponses,
  dataResponsesBatches,
  notarizations,
  notaries,
});

export const notarizationQueue = {
  add: sinon.spy(),
  process: sinon.stub(),
  on: sinon.stub(),
};
export const createQueue = sinon.stub().returns(notarizationQueue);
td.replace('../../src/queues/createQueue', { createQueue });

export const notarize = sinon.spy();
td.replace('../../src/facades/notariesFacade', { notarize });

export const notaryAddress = '0xcccf90140fcc2d260186637d59f541e94ff9288f';

test.beforeEach(() => {
  dataResponsesBatches.fetch.returns({
    orderId: 42,
    notaryAddress,
    dataResponseIds: ['DR1', 'DR2'],
    status: 'created',
  });
  dataResponses.fetch.withArgs('DR1').returns({
    sellerAddress: '0xSellerA',
    sellerId: 10,
    decryptionKeyHash: '0xd48b012bc6c82d8ed80f88d88adf88ab61570d44ad6116f332a42cb7f4681515',
    status: 'queued',
    notaryAddress,
  });
  dataResponses.fetch.withArgs('DR2').returns({
    sellerAddress: '0xSellerB',
    sellerId: 20,
    decryptionKeyHash: '0x8122b2d07f65f4aaf949770358a2341410285968abb75a810a599a2563f8af38',
    status: 'queued',
    notaryAddress,
  });
  notarizations.fetch.returns({
    notaryAddress,
    request: {
      callbackUrl: 'https://bapi.wibson.org/notarization-result/uuid',
      orderId: 42,
      sellers: [
        {
          decryptionKeyHash: '0xd48b012bc6c82d8ed80f88d88adf88ab61570d44ad6116f332a42cb7f4681515',
          sellerAddress: '0xSellerA',
          sellerId: 10,
        },
        {
          decryptionKeyHash: '0x8122b2d07f65f4aaf949770358a2341410285968abb75a810a599a2563f8af38',
          sellerAddress: '0xSellerB',
          sellerId: 20,
        },
      ],
    },
    status: 'created',
  });
  notaries.fetch.returns({
    notarizationUrl: 'https://napi.wibson.org/req-not',
  });
});
test.afterEach(sinon.reset);
