import test from 'ava';
import { promisify } from '../../../src/utils/wibson-lib/collection';

const it = test.serial;

const a = Promise.resolve(1);
const b = Promise.reject(new Error(2));
const c = Promise.resolve(3);

it('resolves all successful promises', async (assert) => {
  const results = await promisify([a, c]);
  assert.is(results[0], 1);
  assert.is(results[1], 3);
});

it('resolves rejected promises', async (assert) => {
  const results = await promisify([b]);
  assert.truthy(results[0], { error: 'Error: 2' });
});

it('removes rejected promises, leaving the array empty', async (assert) => {
  const results = await promisify([b], { removeRejected: true });
  assert.is(results.length, 0);
});

it('removes rejected promises, leaving the successful ones', async (assert) => {
  const results = await promisify([a, b, c], { removeRejected: true });
  assert.is(results.length, 2);
  assert.is(results[0], 1);
  assert.is(results[1], 3);
});

it('resolves to full array, keeping errors', async (assert) => {
  const results = await promisify([a, b, c]);
  assert.is(results.length, 3);
  assert.is(results[0], 1);
  assert.truthy(results[1], { error: 'Error: 2' });
  assert.is(results[2], 3);
});

it('sets custom values to caught promises', async (assert) => {
  const catchCallback = error => ({ custom: true, myError: error });
  const results = await promisify([a, b, c], { catchCallback });
  assert.is(results.length, 3);
  assert.is(results[0], 1);
  assert.truthy(results[1], { custom: true, myError: 'Error: 2' });
  assert.is(results[2], 3);
});
