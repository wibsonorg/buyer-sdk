import request from 'supertest';
import requestPromise from 'request-promise-native';
import sinon from 'sinon';
import app from '../../src/app';

describe('/health', () => {
  describe('GET /', () => {
    it('responds with an OK status', (done) => {
      request(app)
        .get('/health')
        .expect(200, { status: 'OK' }, done);
    });
  });

  describe('GET /deep', () => {
    it('responds with an OK status when app and sub-systems are responding', (done) => {
      const response = { status: 'OK' };

      sinon.stub(requestPromise, 'get')
        .returns(Promise.resolve(JSON.stringify(response)));

      request(app)
        .get('/health/deep')
        .expect(200, response, done);
    });

    it('responds with an error message when sub-system is not responding', (done) => {
      sinon.stub(requestPromise, 'get')
        .throws('RequestError');

      request(app)
        .get('/health/deep')
        .expect(500, { message: 'Signing Service not working as expected', error: '' }, done);
    });

    afterEach(() => {
      requestPromise.get.restore();
    });
  });

  describe('GET /redis', () => {
    it('responds with an OK status', (done) => {
      const getRedisStore = sinon.stub();
      const memoryStorage = {};
      getRedisStore.returns({
        set: (k, v) => { memoryStorage[k] = v; },
        get: k => memoryStorage[k],
      });
      app.locals.getRedisStore = getRedisStore;

      request(app)
        .get('/health/redis')
        .expect(200, { foo: 'bar' }, done);
    });
  });
});
