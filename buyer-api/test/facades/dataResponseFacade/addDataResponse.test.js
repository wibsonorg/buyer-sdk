import test from 'ava';
import { enqueueTransaction, priority } from '../../../src/queues';
import signingService from '../../../src/services/signingService';
import config from '../../../config';
// import request from 'supertest';
// import { addDataResponse } from '../../../src/facades';

const buyerInfoId = 'social-good';
const notaries = ['0x8b64c30a41dbe0ffc74f0cc601bb50a6151eb0c1'];
let transaction = {};

const dataOrder = {
  filters: {
    age: '30..35',
    gender: 'male',
  },
  dataRequest: 'data request',
  price: 20,
  initialBudgetForAudits: 10,
  termsAndConditions: 'DataOrder T&C',
  buyerURL: 'https://buyer.example.com/data',
  buyerInfoId,
  notaries,
};

test.before(async () => {
  const account = await signingService.getAccount();
  const job = await enqueueTransaction(
    account,
    'NewOrder',
    dataOrder,
    config.contracts.gasPrice.fast,
    {
      priority: priority.HIGH,
    },
  );
  transaction = await job.finished();
});

test('responds with error when orderAddress is invalid', (assert) => {
  console.log({ transaction });
  assert.pass();
  /* filters, dataRequest, price, initialBudgetForAudits, buyerURL, notaries, buyerInfoId, */
// await addDataResponse(order, seller, enqueueTransaction)
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
