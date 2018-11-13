import test from 'ava';
import FakeProvider from '../support/FakeProvider';
import web3 from '../../src/utils/web3';
import { signingService } from '../../src/services';
import { enqueueTransaction } from '../../src/queues/transactionQueue';

const fakeProvider = new FakeProvider();
web3.setProvider(fakeProvider);

const receipt = {
  transactionHash: '0xac4d7c6b14e20ca882a989df0e5dc8bb3bcc0d86288ec453b114bf5a6eb52195',
  transactionIndex: 9,
  blockHash: '0x7ddb1859ccfc81b0a7ad03b9f796694c486be36fd24eb1aa33830fcc6c73742b',
  blockNumber: 4397246,
  from: '0x2d419c641352e0baa7f54328ecabf58c5e4a56f1',
  to: '0x0188b5fbbd5220e938f084d4d5d00cc35ce2c029',
  gasUsed: 26056,
  status: 0x1,
};
let account;

const dataPayload = {
  spender: '0x266d2a0f19e43028c6510dcdd32deb1087618224',
  addedValue: 1,
};

const mockTransactionResponse = (tx) => {
  const gasPrice = web3.utils.numberToHex('1000');
  fakeProvider.addResponse('eth_getTransactionCount', web3.utils.numberToHex('1'));
  fakeProvider.addResponse('eth_gasPrice', gasPrice);
  fakeProvider.addResponse('eth_sendRawTransaction', tx.transactionHash);
  fakeProvider.addResponse('eth_getTransactionReceipt', tx);
  // TODO: Web3 needs a second `eth_getTransactionReceipt` call. It woul
  fakeProvider.addResponse('eth_getTransactionReceipt', tx);
};

test.before(async () => {
  account = await signingService.getAccount();
});

// transactionQueue tests
test.skip('retry transaction if connection to blockchain through web3 fails', t => t.fail());
test.skip('responds with error if same transaction is added twice', t => t.fail());

// enqueueTransaction tests
test.skip('responds a job that resolves to a pending transaction', t => t.fail());
test.skip('responds a job that resolves to a transaction with unknown status', t => t.fail());

test.serial('responds a job that resolves to a failed transaction', async (assert) => {
  mockTransactionResponse({ ...receipt, status: 0x0 });

  const job = await enqueueTransaction(account, 'IncreaseApproval', dataPayload, 12);
  const transaction = await job.finished();
  assert.is(transaction.status, 'failure');
  assert.is(transaction.transactionHash, receipt.transactionHash);
});

test.serial('responds a job that resolves to a succeeded transaction', async (assert) => {
  mockTransactionResponse({ ...receipt });

  const job = await enqueueTransaction(account, 'IncreaseApproval', dataPayload, 12);
  const transaction = await job.finished();
  assert.is(transaction.status, 'success');
  assert.is(transaction.transactionHash, receipt.transactionHash);
});
