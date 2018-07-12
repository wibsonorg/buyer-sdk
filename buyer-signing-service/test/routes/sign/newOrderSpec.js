import request from 'supertest';
import app from '../../../src/app';

describe.only('/sign', () => {
  describe('POST /new-order', () => {
    it('responds with an OK status', (done) => {
      request(app)
        .post('/sign/new-order')
        .expect(200, { rawTransaction: '0xasdasdasdasd' }, done);
    });
  });
});
