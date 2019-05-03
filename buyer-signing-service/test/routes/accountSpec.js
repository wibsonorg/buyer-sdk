import request from 'supertest';
import app from '../../src/app';

describe('GET /account', () => {
  it('responds with account information', (done) => {
    request(app)
      .get('/account')
      .expect(200, done);
  });
});
