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
  assert.true(notaries.update.calledOnceWithExactly(notary, {
    infoUrl: notaryUrl, isRegistered: true,
  }));
});

it('updates notary on NotaryUpdated', async (assert) => {
  await onNotaryUpdated({ notary, oldNotaryUrl: notaryUrl, newNotaryUrl });
  assert.true(notaries.update.calledOnceWith(notary, {
    infoUrl: newNotaryUrl,
    oldInfoUrl: notaryUrl,
    isRegistered: true,
  }));
});

it('flags notary as unregistered on NotaryUnregistered', async (assert) => {
  await onNotaryUnregistered({ notary, oldNotaryUrl: notaryUrl });
  assert.true(notaries.update.calledOnceWith(notary, {
    infoUrl: undefined,
    oldInfoUrl: notaryUrl,
    isRegistered: false,
  }));
});
