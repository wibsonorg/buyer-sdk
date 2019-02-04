import it from 'ava';
import { res, next, dataOrders } from './fetchDataOrder.mock';
import middleware from '../../../../src/routes/dataOrders/middlewares/fetchDataOrder';

const req = { params: { id: 'some-uuid' } };

it('adds the dataOrder field in the request', async (assert) => {
  await middleware(req, res, next);
  assert.deepEqual(req.dataOrder, { status: 'created' });
});

it('calls the next middleware', async (assert) => {
  await middleware(req, res, next);
  assert.true(next.called);
});

it('writes a Not Found response', async (assert) => {
  dataOrders.fetch.throws(new Error('Key not found in database [id]'));
  await middleware(req, res, next);
  assert.deepEqual(res.boom.notFound.lastCall.args, ['DataOrder not found']);
});
