import test from 'ava';
import sinon from 'sinon';
import web3 from '../../src/utils/web3';
import { createDataOrderFacade } from '../../src/facades';
import { storeBuyerInfo } from '../../src/services';

const filters = { age: '30..35' };
const dataRequest = 'data request';
const price = 20;
const initialBudgetForAudits = 10;
const termsAndConditions = 'asd';
const buyerURL = 'asd';
const buyerInfoId = 'social-good';
let notaries = [];

test.before(async () => {
  const accounts = await web3.eth.getAccounts();
  notaries = [accounts[5], accounts[6]];

  await storeBuyerInfo(buyerInfoId, {
    id: buyerInfoId,
    label: 'Social Good',
    description: 'Social Good $ Research',
    category: {
      id: 'research-social-good',
      label: 'Social Good & Research',
      description: 'Social Good & more Research',
    },
    terms: '# WIBSON ALPHA TERMS OF USE',
  });
});

test.skip('responds with error if filters is not present', t => t.fail());
test.skip('responds with error if dataRequest is not present', t => t.fail());
test.skip('responds with error if price is not present', t => t.fail());
test.skip('responds with error if initialBudgetForAudits is not present', t => t.fail());
test.skip('responds with error if termsAndConditions is not present', t => t.fail());
test.skip('responds with error if buyerURL is not present', t => t.fail());

test('responds successfully', async (assert) => {
  const callback = sinon.spy();

  const fakeEnqueueTransaction = () => ({
    finished() {
      return {
        then: callback,
      };
    },
  });

  const fakeEnqueueJob = () => true;

  const response = await createDataOrderFacade({
    filters,
    dataRequest,
    price,
    initialBudgetForAudits,
    termsAndConditions,
    buyerURL,
    notaries,
    buyerInfoId,
  }, fakeEnqueueTransaction, fakeEnqueueJob);

  assert.is(response.success(), true);
  assert.is(callback.called, true);
});
