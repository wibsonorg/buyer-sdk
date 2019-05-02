import { serial as it } from 'ava';
import { putData, dataResponses, addProcessDataResponseJob } from './addDataResponse.mock';
import { addDataResponse } from '../../src/operations/addDataResponse';

const dataOrder = {
  price: 45,
  status: 'created',
  notariesAddresses: ['0xccCF90140Fcc2d260186637D59F541E94Ff9288f'],
};
const someDataResponse = {
  orderId: 42,
  sellerAddress: '0xa42df59C5e17df255CaDfF9F52a004221f774f36',
  sellerId: 1085,
  encryptedData: 'tZ4MsEnfbcDOwqau68aOrQ==',
  decryptedDataHash: '8f54f1c2d0eb5771cd5bf67a6689fcd6eed9444d91a39e5ef32a9b4ae5ca14ff',
  decryptionKeyHash: '07855b46a623a8ecabac76ed697aa4e13631e3b6718c8a0d342860c13c30d2fc',
  notaryAddress: '0xccCF90140Fcc2d260186637D59F541E94Ff9288f',
  needsRegistration: false,
};

it('returns id and status', async (assert) => {
  const { id, status } = await addDataResponse(dataOrder, someDataResponse);
  assert.is(id, '42:0xa42df59C5e17df255CaDfF9F52a004221f774f36');
  assert.is(status, 'queued');
});

it('returns the id and status of the already stored DataResponse', async (assert) => {
  dataResponses.safeFetch.returns({ status: 'queued' });
  await addDataResponse(dataOrder, someDataResponse);
  assert.false(dataResponses.store.called);
  assert.false(putData.called);
  assert.false(addProcessDataResponseJob.called);
});

it('returns id and waiting status when sellerId is not present', async (assert) => {
  const { status } = await addDataResponse(
    dataOrder,
    {
      ...someDataResponse,
      sellerAddress: undefined,
    },
  );
  assert.is(status, 'waiting');
});

it('returns an error when DataOrder is closed', async (assert) => {
  const { error, status } = await addDataResponse(
    { status: 'closed' },
    someDataResponse,
  );
  assert.is(status, undefined);
  assert.is(error, 'Can\'t accept DataReponse');
});

it('returns an error when the notary is not in the preferred ones', async (assert) => {
  const { error, status } = await addDataResponse(
    dataOrder,
    {
      ...someDataResponse,
      notaryAddress: '0xasd',
    },
  );
  assert.is(status, undefined);
  assert.is(error, 'Can\'t accept DataReponse for notary 0xasd');
});

it('stores the DataResponse', async (assert) => {
  await addDataResponse(dataOrder, someDataResponse);
  assert.snapshot(dataResponses.store.lastCall.args, { id: 'dataResponses.store().args' });
});

it('stores the Data in S3', async (assert) => {
  await addDataResponse(dataOrder, someDataResponse);
  assert.snapshot(putData.lastCall.args, { id: 's3.putData().args' });
});

it('adds job to process the DataResponse', async (assert) => {
  await addDataResponse(dataOrder, someDataResponse);
  assert.snapshot(addProcessDataResponseJob.lastCall.args, { id: 'addProcessDataResponseJob().args' });
});
