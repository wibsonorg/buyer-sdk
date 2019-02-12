import test from 'ava';
import { api, someNotarizationRequest as notarizationRequest } from './receiveNotarizationResult.mock';

const it = test.serial;
const notarizationRequestId = '0x87c2d362de99f75a4f2755cdaaad2d11bf6cc65dc71356593c445535ff28f43d';

it('receiveNotarizationResult > authenticates', async (assert) => {
  const res = await api.post('authentication', { password: 'passphrase' });
  assert.true(res.authenticated);
  api.setToken(res.token);
});

it('receiveNotarizationResult > ', async (assert) => {
  const { message } = await api
    .post(`notarization-result/${notarizationRequestId}`, notarizationRequest)
    .catch(err => err.response.data);
  assert.true(['OK', 'The ID already exists'].includes(message));
});
