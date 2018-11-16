import test from 'ava';
import sinon from 'sinon';
import client from 'request-promise-native';
import { closeDataResponse } from '../../../src/facades';
import * as notariesFacade from '../../../src/facades/notariesFacade';
import * as utils from '../../../src/utils'; // { dataOrderAt }
import config from '../../../config';

const fakeAddress = '0x1234567890123456789123456789012345678901';

test.afterEach.always(() => { sinon.restore(); });

test.serial('throws an error when orderAddress is invalid', async (assert) => {
  const error = await assert.throws(closeDataResponse('I will fail!', fakeAddress, undefined));
  assert.is(error.message, 'Invalid order|seller address');
});

test.serial('throws an error when sellerAddress is invalid', async (assert) => {
  const error = await assert.throws(closeDataResponse(fakeAddress, 'I will fail!', undefined));
  assert.is(error.message, 'Invalid order|seller address');
});

test.serial('responds true if dataResponse is already closed', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({ methods: { getSellerInfo: () => ({ call: () => ['useless', 'useless', 'useless', 'useless', 'useless', '0x'] }) } }));
  const callback = sinon.spy();
  const result = await closeDataResponse(fakeAddress, fakeAddress, callback);
  assert.true(result);
  assert.false(callback.called);
});

test.serial('demands audits from notaries in notariesToDemandAuditsFrom', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({
    methods:
    {
      // 0x44617461526573706f6e73654164646564 == web3.utils.toHex('DataResponseAdded')
      getSellerInfo: () => ({ call: () => ['useless', fakeAddress, 'useless', 'useless', 'useless', '0x44617461526573706f6e73654164646564'] }),
      buyer: () => ({ call: () => fakeAddress }),
    },
  }));
  sinon.stub(notariesFacade, 'getNotaryInfo').value(() => ({ publicUrls: { api: 'http://localhost:12345' } }));
  sinon.stub(config.notary, 'demandAuditsFrom').value(JSON.stringify([fakeAddress]));
  const clientStub = sinon.stub(client, 'post').resolves({ dataResponses: [{ result: 'ok' }] });
  await closeDataResponse(fakeAddress, fakeAddress, () => {});
  assert.true(clientStub.called);
});

test.serial('throws if audit is in progress', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({
    methods:
    {
      // 0x44617461526573706f6e73654164646564 == web3.utils.toHex('DataResponseAdded')
      getSellerInfo: () => ({ call: () => ['useless', fakeAddress, 'useless', 'useless', 'useless', '0x44617461526573706f6e73654164646564'] }),
      buyer: () => ({ call: () => fakeAddress }),
    },
  }));
  sinon.stub(notariesFacade, 'getNotaryInfo').value(() => ({ publicUrls: { api: 'http://this.does.not.exist' } }));
  sinon.stub(config.notary, 'demandAuditsFrom').value(JSON.stringify([]));
  sinon.stub(client, 'post').resolves({ dataResponses: [{ result: 'in-progress' }] });
  const error = await assert.throws(closeDataResponse(fakeAddress, fakeAddress, undefined));
  assert.is(error.message, 'Audit result is in progress');
});

test.serial('returns true if dataResponse is successfully closed', async (assert) => {
  sinon.stub(utils, 'dataOrderAt').value(() => ({
    methods:
    {
      // 0x44617461526573706f6e73654164646564 == web3.utils.toHex('DataResponseAdded')
      getSellerInfo: () => ({ call: () => ['useless', fakeAddress, 'useless', 'useless', 'useless', '0x44617461526573706f6e73654164646564'] }),
      buyer: () => ({ call: () => fakeAddress }),
    },
  }));
  sinon.stub(notariesFacade, 'getNotaryInfo').value(() => ({ publicUrls: { api: 'http://this.does.not.exist' } }));
  sinon.stub(config.notary, 'demandAuditsFrom').value(JSON.stringify([]));
  sinon.stub(client, 'post').resolves({ dataResponses: [{ result: 'ok' }] });
  const callback = sinon.spy();
  const result = await closeDataResponse(fakeAddress, fakeAddress, callback);
  assert.true(result);
  assert.true(callback.called);
});
