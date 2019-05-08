import test from 'ava';
import { notaries } from './notariesSubscribers.mock';
import './contractEventSubscribers.mock';
import {
  onNotaryRegistered,
  onNotaryUpdated,
  onNotaryUnregistered,
} from '../../../src/blockchain/contractEventSubscribers/notariesSubscribers';

const it = test.serial;

const notary = '0x8ec07260cbb35f14b8c7d647b11b7375342f063d';
const notaryUrl = 'https://www.napi.com/notary-info';
const newNotaryUrl = 'https://www.napi.com/new-notary-info';

it('stores the new notary', async (assert) => {
  await onNotaryRegistered({ notary, notaryUrl });
  assert.true(notaries.update.calledOnce);
  assert.is(notaries.update.firstCall.args[0], notary);
  assert.truthy(notaries.update.firstCall.args[1], { infoUrl: notaryUrl, isRegistered: true });
});

it('updates existing notary on NotaryUpdated', async (assert) => {
  await onNotaryRegistered({ notary, notaryUrl });
  await onNotaryUpdated({ notary, oldNotaryUrl: notaryUrl, newNotaryUrl });
  assert.true(notaries.update.calledTwice);
  assert.is(notaries.update.lastCall.args[0], notary);
  assert.truthy(notaries.update.lastCall.args[1], {
    infoUrl: newNotaryUrl,
    oldNotaryUrl: notaryUrl,
    isRegistered: true,
  });
});

it('stores notary on NotaryUpdated even if it was not stored before', async (assert) => {
  await onNotaryUpdated({ notary, oldNotaryUrl: notaryUrl, newNotaryUrl });
  assert.true(notaries.update.calledOnce);
  assert.is(notaries.update.lastCall.args[0], notary);
  assert.truthy(notaries.update.lastCall.args[1], {
    infoUrl: newNotaryUrl,
    oldNotaryUrl: notaryUrl,
    isRegistered: true,
  });
});

it('flags notary as unregistered on NotaryUnregistered', async (assert) => {
  await onNotaryUnregistered({ notary, oldNotaryUrl: notaryUrl });
  assert.true(notaries.update.calledOnce);
  assert.is(notaries.update.lastCall.args[0], notary);
  assert.truthy(notaries.update.lastCall.args[1], {
    infoUrl: undefined,
    oldInfoUrl: notaryUrl,
    isRegistered: false,
  });
});
