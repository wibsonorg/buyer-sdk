import test from 'ava';
import sinon from 'sinon';
import * as s3 from '../../../src/utils/wibson-lib/s3'; // { getDataResponse }
import * as utils from '../../../src/utils'; // { dataOrderAt }

// addDataResponse(order, seller, enqueueTransaction)
import { addDataResponse } from '../../../src/facades';

const fakeAddress = '0x1234567890123456789123456789012345678901';
const fakeSignature = '0x1234567890123456789123456789012345678901123456789012345678912345678901234567890112345678901234567891234567890123456789011234567890';

test.afterEach.always(() => { sinon.restore(); });

test.serial('responds with error when orderAddress is invalid', async (assert) => {
  const error = await assert.throws(addDataResponse('I will fail!', fakeAddress, undefined));
  assert.is(error.message, 'Invalid order|seller address');
});

test.serial('responds with error when sellerAddress is invalid', async (assert) => {
  const error = await assert.throws(addDataResponse(fakeAddress, 'I will fail!', undefined));
  assert.is(error.message, 'Invalid order|seller address');
});

test.serial('responds true if seller has already accepted', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({ methods: { hasSellerBeenAccepted: () => ({ call: () => true }) } }));
  const callback = sinon.spy();
  const result = await addDataResponse(fakeAddress, fakeAddress, callback);
  assert.true(result); // true means that the user has already sent a dataResponse to this dataOrder
  assert.false(callback.called);
});

test.serial('throws if it cannot retrieve data response from storage', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({ methods: { hasSellerBeenAccepted: () => ({ call: () => false }) } }));
  sinon.stub(s3, 'getDataResponse').rejects('S3 failing');
  const callback = sinon.spy();
  const error = await assert.throws(addDataResponse(fakeAddress, fakeAddress, callback));
  assert.is(error.message, 'Could not retrieve data response from storage');
  assert.false(callback.called);
});

test.serial('throws if notaryAccount is not an address', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({ methods: { hasSellerBeenAccepted: () => ({ call: () => false }) }, options: { address: fakeAddress } }));
  sinon.stub(s3, 'getDataResponse').value(async () => ({ notaryAccount: '0x', dataHash: fakeAddress, signature: fakeSignature }));
  const callback = sinon.spy();
  const error = await assert.throws(addDataResponse(fakeAddress, fakeAddress, callback));
  assert.is(error.message, 'Invalid data response payload');
  assert.false(callback.called);
});

test.serial('throws if dataHash is undefined', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({ methods: { hasSellerBeenAccepted: () => ({ call: () => false }) }, options: { address: fakeAddress } }));
  sinon.stub(s3, 'getDataResponse').value(async () => ({ notaryAccount: fakeAddress, dataHash: undefined, signature: fakeSignature }));
  const callback = sinon.spy();
  const error = await assert.throws(addDataResponse(fakeAddress, fakeAddress, callback));
  assert.is(error.message, 'Invalid data response payload');
  assert.false(callback.called);
});

test.serial('throws if signature is undefined', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({ methods: { hasSellerBeenAccepted: () => ({ call: () => false }) }, options: { address: fakeAddress } }));
  sinon.stub(s3, 'getDataResponse').value(async () => ({ notaryAccount: fakeAddress, dataHash: fakeAddress, signature: undefined }));
  const callback = sinon.spy();
  const error = await assert.throws(addDataResponse(fakeAddress, fakeAddress, callback));
  assert.is(error.message, 'Invalid data response payload');
  assert.false(callback.called);
});

test.serial('throws if notary is not added to dataorder', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({ methods: { hasSellerBeenAccepted: () => ({ call: () => false }), hasNotaryBeenAdded: () => ({ call: () => false }) }, options: { address: fakeAddress } }));
  sinon.stub(s3, 'getDataResponse').value(async () => ({ notaryAccount: fakeAddress, dataHash: fakeAddress, signature: fakeSignature }));
  const callback = sinon.spy();
  const error = await assert.throws(addDataResponse(fakeAddress, fakeAddress, callback));
  assert.is(error.message, 'Invalid notary');
  assert.false(callback.called);
});

test.serial('throws if buyer does not have enough allowance to add DataResponse', async (assert) => {
  // In this case the user has 10 of allowance and it requires 100
  sinon.stub(utils, 'dataOrderAt').value(() =>
    ({
      methods: {
        hasSellerBeenAccepted: () => ({ call: () => false }),
        hasNotaryBeenAdded: () => ({ call: () => true }),
        price: () => ({ call: () => 100 }),
        getNotaryInfo: () => ({ call: () => ['useless', 'useless', 10] }),
      },
      options: {
        address: fakeAddress,
      },
    }));
  sinon.stub(utils, 'dataExchange').value({ methods: { buyerRemainingBudgetForAudits: () => ({ call: () => 10 }) }, options: { address: fakeAddress } });
  sinon.stub(utils, 'wibcoin').value({ methods: { allowance: () => ({ call: () => 10 }) }, options: { address: fakeAddress } });
  sinon.stub(s3, 'getDataResponse').value(async () => ({ notaryAccount: fakeAddress, dataHash: fakeAddress, signature: fakeSignature }));
  const callback = sinon.spy();
  const error = await assert.throws(addDataResponse(fakeAddress, fakeAddress, callback));
  assert.is(error.message, 'Not enough allowance to add DataResponse');
  assert.false(callback.called);
});

test.serial('returns true if dataResponse is successfully added', async (assert) => {
  // In this case the user has 100000 of allowance and it requires 100
  sinon.stub(utils, 'dataOrderAt').value(() =>
    ({
      methods: {
        hasSellerBeenAccepted: () => ({ call: () => false }),
        hasNotaryBeenAdded: () => ({ call: () => true }),
        price: () => ({ call: () => 100 }),
        getNotaryInfo: () => ({ call: () => ['useless', 'useless', 10] }),
      },
      options: {
        address: fakeAddress,
      },
    }));
  sinon.stub(utils, 'dataExchange').value({ methods: { buyerRemainingBudgetForAudits: () => ({ call: () => 10 }) }, options: { address: fakeAddress } });
  sinon.stub(utils, 'wibcoin').value({ methods: { allowance: () => ({ call: () => 100000 }) }, options: { address: fakeAddress } });
  sinon.stub(s3, 'getDataResponse').value(async () => ({ notaryAccount: fakeAddress, dataHash: fakeAddress, signature: fakeSignature }));
  const callback = sinon.spy();
  const result = await addDataResponse(fakeAddress, fakeAddress, callback);
  assert.true(callback.called);
  assert.true(result);
});
