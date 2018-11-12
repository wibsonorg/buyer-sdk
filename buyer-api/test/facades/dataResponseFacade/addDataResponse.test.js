import test from 'ava';
import sinon from 'sinon';
// import signingService from '../../../src/services/signingService';
import * as utils from '../../../src/utils'; // { dataOrderAt }
import * as s3 from '../../../src/utils/wibson-lib/s3'; // { getDataResponse }
// import request from 'supertest';
import { addDataResponse } from '../../../src/facades';

test.before(async () => {
  sinon.stub(utils, 'dataOrderAt').callsFake(() => ({
    methods: {
      hasSellerBeenAccepted: () => ({
        call: () => 1,
      }),
    },
  }));
  sinon.stub(s3, 'getDataResponse').callsFake(() => ({
    notaryAccount: '0x',
    dataHash: '0x',
    signature: '0x',
  }));
  // const account = await signingService.getAccount();
});

test('responds with error when orderAddress is invalid', async (assert) => {
  // order, seller, enqueueTransaction
  const error = await assert.throws(addDataResponse('I will fail!', undefined, undefined));
  assert.is(error.message, 'Invalid order|seller address');
});

test.skip('responds with error when sellerAddress is invalid', t => t.fail());
test.skip('responds true if seller has already accepted', t => t.fail());
test.skip('throws if it cannot retrieve data response from storage', t => t.fail());
test.skip('throws if notaryAccount is not an address', t => t.fail());
test.skip('throws if dataHash is undefined', t => t.fail());
test.skip('throws if signature is undefined', t => t.fail());
test.skip('throws if notary is not added to dataorder', t => t.fail());
test.skip('throws if buyer does not have enough allowance to add DataResponse', t => t.fail());
test.skip('returns true if dataResponse is successfully added', t => t.fail());
