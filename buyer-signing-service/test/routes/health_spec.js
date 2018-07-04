import request from 'supertest';
import app from '../../src/app';

describe('/health', () => {
  describe('GET /', () => {
    it('responds with an OK status', (done) => {
      request(app)
        .get('/health')
        .expect(200, { status: 'OK' }, done);
    });
  });
});
