import test from 'ava';
import { getRawOrderData } from './getOrderData.mock';
import { getOrderData } from '../../src/operations/getOrderData';

const it = test.serial;
const someDataOrderWithProfile = {
  dxId: 1,
  requestedData: ['google-profile'],
};
const otherDataOrder = {
  dxId: 1,
  requestedData: ['geolocation'],
};

it('return the email of sellers in CSV format', async (assert) => {
  const { data } = await getOrderData(someDataOrderWithProfile);
  assert.is(
    data,
    '"email"\n"testmobilegd1@gmail.com"\n"testmobilegd2@gmail.com"\n"testmobilegd3@gmail.com"',
  );
});

it('return error: not found', async (assert) => {
  getRawOrderData.returns(null);
  const { error } = await getOrderData(someDataOrderWithProfile);
  assert.is(error.code, 'getOrderData.not_found');
});

it("return error: don't support", async (assert) => {
  const { error } = await getOrderData(otherDataOrder);
  assert.is(error.code, 'getOrderData.not_implemented');
});
