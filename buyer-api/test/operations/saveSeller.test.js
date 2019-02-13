import test from 'ava';
import { sellers } from './saveSeller.mock';
import { saveSeller } from '../../src/operations/saveSeller';

const it = test.serial;

it('saves seller id', async (assert) => {
  await saveSeller('1', 1);
  assert.true(sellers.put.called);
});

it('doesn`t save id when address already registered', async (assert) => {
  await saveSeller('2', 1);
  assert.false(sellers.put.called);
});
