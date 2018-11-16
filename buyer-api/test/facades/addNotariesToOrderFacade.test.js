import test from 'ava';
import { addNotariesToOrderFacade } from '../../src/facades';

const noop = () => false;

const orderAddress = '0xa662a5c63079009d79740f4e638a404f7917f93a';
const notaries = [];

test.skip('responds with error when orderAddress is not present', t => t.fail());
test('responds with error when notaries is not present', async (assert) => {
  const response = await addNotariesToOrderFacade(
    orderAddress,
    notaries,
    noop,
  );

  assert.is(response.success(), false);
});
test.skip('responds with error when orderAddress is not present', t => t.fail());
test.skip('responds with error when responsesPercentage is not present', t => t.fail());
test.skip('responds with error when notarizationFee is not present', t => t.fail());
test.skip('responds with error when notarizationTermsOfService is not present', t => t.fail());
test.skip('responds with error when notarySignature is not present', t => t.fail());
test.skip('responds successfully', t => t.fail());
