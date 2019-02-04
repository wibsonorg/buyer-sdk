import test from 'ava';
import { api, wibsonBuyer, dataOrder } from './createDataOrder.mock';

const it = test.serial;

it('createDataOrder > authenticates', async (assert) => {
  const res = await api.post('authentication', { password: 'passphrase' });
  assert.true(res.authenticated);
  api.setToken(res.token);
});

it('createDataOrder > has or creates buyer', async (assert) => {
  const { message } = await api
    .post('infos', wibsonBuyer)
    .catch(err => err.response.data);
  assert.true(['OK', 'The ID already exists'].includes(message));
});

it('createDataOrder > starts data order creation', async (assert) => {
  const { status, id } = await api.post('orders', { dataOrder });
  dataOrder.id = id;
  assert.is(status, 'creating');
});

it('createDataOrder > gets data order with creating status', async (assert) => {
  const { status } = await api.get(`orders/${dataOrder.id}`);
  assert.is(status, 'creating');
});

it('createDataOrder > waits for ganache to process the tx then gets the order with creatd status', async (assert) => {
  let status;
  for (let i = 0; i < 120 && status !== 'created'; i += 1) {
    /* eslint-disable no-await-in-loop */
    await new Promise(res => setTimeout(res, 1000));
    ({ status } = await api.get(`orders/${dataOrder.id}`));
  }
  assert.is(status, 'created');
});
