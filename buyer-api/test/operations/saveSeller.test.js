import test from 'ava';
import { sellers } from './saveSeller.mock';
import { saveSeller } from '../../src/operations/saveSeller';

const it = test.serial;

it('saves seller id', async (assert) => {
  await saveSeller('1', 1);
  assert.true(sellers.put.called);
});

it('returns true when id is same as saved', async (assert) => {
  await saveSeller('2', 3);
  assert.false(sellers.put.called);
});

it('doesn`t save id when address already registered and id is not the same', async (assert) => {
  await saveSeller('2', 1);
  assert.false(sellers.put.called);
});
