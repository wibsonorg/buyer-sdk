import test from 'ava';
import FakeProvider from '../support/FakeProvider';
import createReceipt from '../support/receiptFactory';
import web3 from '../../src/utils/web3';
import { signingService } from '../../src/services';
import { enqueueTransaction } from '../../src/queues/transactionQueue';

const fakeProvider = new FakeProvider();
web3.setProvider(fakeProvider);

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
  // TODO: Review if this second call is needed.
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
  const receipt = createReceipt({ from: account.address, status: '0x0' });
  mockTransactionResponse(receipt);

  const job = await enqueueTransaction(account, 'IncreaseApproval', dataPayload, 12);
  const transaction = await job.finished();
  assert.is(transaction.status, 'failure');
  assert.is(transaction.transactionHash, receipt.transactionHash);
});

test.serial('responds a job that resolves to a succeeded transaction', async (assert) => {
  const receipt = createReceipt({ from: account.address, status: '0x1' });
  mockTransactionResponse(receipt);

  const job = await enqueueTransaction(account, 'IncreaseApproval', dataPayload, 12);
  const transaction = await job.finished();
  assert.is(transaction.status, 'success');
  assert.is(transaction.transactionHash, receipt.transactionHash);
});
