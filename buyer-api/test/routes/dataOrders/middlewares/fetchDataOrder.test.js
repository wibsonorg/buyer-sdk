import it from 'ava';
import { res, next } from './fetchDataOrder.mock';
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
  req.params.id = 'not-found';
  await middleware(req, res, next);
  assert.snapshot(res.boom.notFound.lastCall.args);
});
