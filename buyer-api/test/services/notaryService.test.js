import test from 'ava';
import { addTransactionJob } from './notaryService.mock';
import { transferNotarizacionResult } from '../../src/services/notaryService';

const it = test.serial;

export const someNotarizationResult = {
  sellers: [
    {
      id: 78,
      address: '0x338fff484061da07323e994990c901d322b6927a',
      result: 'ok',
      decryptionKeyEncryptedWithMasterKey: '0x912f8f484454e3a38f7535fbf6b7f0035a0fe27c028163348965eb9369fcca8c',
    },
    {
      id: 84,
      address: '0x2d419c641352e0baa7f54328ecabf58c5e4a56f1',
      result: 'not_audited',
      decryptionKeyEncryptedWithMasterKey: '0x912f8f484454e3a38f7535fbf6b7f0035a0fe27c028163348965eb9369fcca8c',
    },
  ],
  orderId: 114,
  notaryAddress: '0xfe174860ad53e45047BABbcf4aff735d650D9284',
  notarizationPercentage: 30,
  notarizationFee: 10000000000,
  payDataHash: '0x0bb68ec2b34b7b611727f7340d7c6e0ee5a580090583d92b7639861802b9e116',
  lock: '0xde916ce0390bd5408b7a0a52aae818fd973858c7e9b5d368ec1e6a9b0db44cf9',
};

it('calls addTransactionJob with correct payload', async (assert) => {
  const result = await transferNotarizacionResult(someNotarizationResult);
  assert.is(result.amount, 999);
  // TODO: make this work
  // assert.is(result.payData, '0x79ee611a8f7a448ca7406693beb1858a8ec7415a114');

  assert.snapshot(addTransactionJob.lastCall.args, { id: 'addNotarizacionResultJob().args' });
});
