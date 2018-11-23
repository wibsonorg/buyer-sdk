import test from 'ava';
import sinon from 'sinon';
import FakeProvider from '../support/FakeProvider';
import createReceipt from '../support/receiptFactory';
import { web3, wibcoin } from '../../src/utils';
import { signingService } from '../../src/services';
import {
  enqueueTransaction,
  transactionQueue,
} from '../../src/queues/transactionQueue';

const web3FakeProvider = new FakeProvider();
web3.setProvider(web3FakeProvider);

const tokenFakeProvider = new FakeProvider();
wibcoin.setProvider(tokenFakeProvider);

let account;

const dataPayload = {
  spender: '0x266d2a0f19e43028c6510dcdd32deb1087618224',
  addedValue: 1,
};

const mockTransactionResponse = (tx, fakeProvider) => {
  const gasPrice = web3.utils.numberToHex('1000');
  fakeProvider.addResponse('eth_getTransactionCount', web3.utils.numberToHex('1'));
  fakeProvider.addResponse('eth_gasPrice', gasPrice);
  fakeProvider.addResponse('eth_sendRawTransaction', tx.transactionHash);
  fakeProvider.addResponse('eth_getTransactionReceipt', tx);
  // TODO: Review if this second call is needed.
  fakeProvider.addResponse('eth_getTransactionReceipt', tx);
};

test.before(async () => {
  web3FakeProvider.clear();
  tokenFakeProvider.clear();
  account = await signingService.getAccount();
});

test.beforeEach(async () => {
  await transactionQueue.resume();
});

test.afterEach(async () => {
  await transactionQueue.empty();
})

// transactionQueue tests
test.skip('retry transaction if connection to blockchain through web3 fails', t => t.fail());
test.skip('responds with error if same transaction is added twice', t => t.fail());

// enqueueTransaction tests
test.skip('responds a job that resolves to a pending transaction', t => t.fail());
test.skip('responds a job that resolves to a transaction with unknown status', t => t.fail());

test.serial('responds a job that resolves to a failed transaction', async (assert) => {
  web3FakeProvider.addResponse('eth_getBalance', web3.utils.toHex('100000000000000000'));
  tokenFakeProvider.addResponse('eth_call', web3.utils.toHex('100000000000000000'));

  const receipt = createReceipt({ from: account.address, status: '0x0' });
  mockTransactionResponse(receipt, web3FakeProvider);

  const job = await enqueueTransaction(account, 'IncreaseApproval', dataPayload, 12);
  const transaction = await job.finished();
  assert.is(transaction.status, 'failure');
  assert.is(transaction.transactionHash, receipt.transactionHash);
});

test.serial('responds a job that resolves to a succeeded transaction', async (assert) => {
  web3FakeProvider.addResponse('eth_getBalance', web3.utils.toHex('100000000000000000'));
  tokenFakeProvider.addResponse('eth_call', web3.utils.toHex('100000000000000000'));

  const receipt = createReceipt({ from: account.address, status: '0x1' });
  mockTransactionResponse(receipt, web3FakeProvider);

  const job = await enqueueTransaction(account, 'IncreaseApproval', dataPayload, 12);
  const transaction = await job.finished();
  assert.is(transaction.status, 'success');
  assert.is(transaction.transactionHash, receipt.transactionHash);
});

test.serial('pauses the queue and re-enqueues the job when there is not enough ETH', async (assert) => {
  web3FakeProvider.addResponse('eth_getBalance', web3.utils.toHex('1'));
  tokenFakeProvider.addResponse('eth_call', web3.utils.toHex('100000000000000000'));
  const callback = sinon.spy();

  transactionQueue.on('paused', callback);
  const job = await enqueueTransaction(account, 'IncreaseApproval', dataPayload, 12);
  const { newJobId, data } = await job.finished();
  assert.true(callback.called);
  assert.truthy(newJobId);
  assert.deepEqual(data.account, account);
  assert.is(data.name, 'IncreaseApproval');
  assert.deepEqual(data.params, dataPayload);
});

test.serial('pauses the queue and re-enqueues the job when there is not enough WIB', async (assert) => {
  web3FakeProvider.addResponse('eth_getBalance', web3.utils.toHex('100000000000000000'));
  tokenFakeProvider.addResponse('eth_call', web3.utils.toHex('1'));
  const callback = sinon.spy();

  transactionQueue.on('paused', callback);
  const job = await enqueueTransaction(account, 'IncreaseApproval', dataPayload, 12);
  const { newJobId, data } = await job.finished();
  assert.true(callback.called);
  assert.truthy(newJobId);
  assert.deepEqual(data.account, account);
  assert.is(data.name, 'IncreaseApproval');
  assert.deepEqual(data.params, dataPayload);
});
