import request from 'supertest';
import config from '../../config';
import app from '../../src/app';

describe('GET /account', () => {
  beforeEach(() => {
    config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
  });

  it('responds with account information', (done) => {
    request(app)
      .get('/account')
      .expect(200, done);
  });
});
