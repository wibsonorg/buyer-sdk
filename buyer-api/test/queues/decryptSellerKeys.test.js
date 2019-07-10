import { serial as it } from 'ava';
import { prepareTests, fakeQueue, notarizations, job, getData, safeGetRawOrderData, putRawOrderData, fakeNotarization, data, sellerAddress, initialRawData } from './decryptSellerKeys.mock';
import { addDecryptJob, decryptSellersKeysJobListener } from '../../src/queues/decryptSellerKeys';

prepareTests();

it('addDecryptJob adds a decrypt job', async (t) => {
  const params = {
    notarizationId: job.data.notarizationId,
  };
  await addDecryptJob(params);
  t.true(fakeQueue.add.calledOnceWithExactly('decrypt', params));
});

it('decryptSellersKeysJobListener works as expected', async (t) => {
  await decryptSellersKeysJobListener(job);
  t.true(notarizations.fetch.calledOnceWithExactly(job.data.notarizationId));
  // eslint-disable-next-line max-len
  const { orderId } = fakeNotarization.request;
  t.deepEqual(getData.firstCall.args, [orderId, fakeNotarization.result.sellers[0].address]);
  t.true(getData.calledOnceWithExactly(orderId, fakeNotarization.result.sellers[0].address));
  t.true(safeGetRawOrderData.calledOnceWithExactly(orderId));

  const expected = {
    ...initialRawData,
    [sellerAddress]: data,
  };
  t.deepEqual(putRawOrderData.firstCall.args, [orderId, expected]);
  t.truthy(putRawOrderData.calledOnceWithExactly(orderId, expected));
});
