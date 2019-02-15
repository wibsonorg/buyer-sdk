import test from 'ava';
import uuidv4 from 'uuid/v4';
import { createLevelStore } from '../../src/utils/storage';

const it = test.serial;

/** @type {import('../../src/utils/storage').LevelStore<string, string>} */
const store = createLevelStore('test_store_async_await');

const aLot = 1e5;
const records = Array.from({ length: aLot }, () => ({
  id: uuidv4(), value: uuidv4(),
}));

it(`stores ${aLot} of records`, async (assert) => {
  try {
    await Promise.all(records.map(({ id, value }) => store.store(id, value)));
  } catch (err) {
    assert.fail(err.message);
  }
});

it(`stores ${aLot} more while reading previous ones`, async (assert) => {
  try {
    await Promise.all([
      Promise.all(records.map(({ id }) => store.fetch(id))),
      Promise.all(records.map(({ id, value }) => store.store(value, id))),
    ]);
  } catch (err) {
    assert.fail(err.message);
  }
});

it('reads all stored values', async (assert) => {
  try {
    await Promise.all([
      Promise.all(records.map(({ id }) => store.fetch(id))),
      Promise.all(records.map(({ value }) => store.fetch(value))),
    ]);
  } catch (err) {
    assert.fail(err.message);
  }
});

it('stores a group and retrives all values in the group and only those', async (assert) => {
  const group = uuidv4();
  try {
    await Promise.all(records.map(({ id, value }) => store.store(`${group}:${id}`, { value })));
    const expectedValues = records.map(({ id, value }) => ({ id: `${group}:${id}`, value }));
    const realValues = await store.list(group);
    assert.deepEqual(
      realValues.sort((a, b) => a.id.localeCompare(b.id)),
      expectedValues.sort((a, b) => a.id.localeCompare(b.id)),
    );
  } catch (err) {
    assert.fail(err.message);
  }
});
