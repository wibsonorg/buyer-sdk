import request from 'supertest';
import { expect } from 'chai';
import requestPromise from 'request-promise-native';
import sinon from 'sinon';
import { mockStorage, restoreMocks } from '../helpers';

describe('/health', () => {
  let app;

  beforeEach(function (done) { // eslint-disable-line func-names
    this.timeout(5000);
    mockStorage();
    app = require('../../src/app'); // eslint-disable-line global-require
    done();
  });

  afterEach(() => {
    restoreMocks();
  });

  describe('GET /', () => {
    it('responds with an OK status', (done) => {
      request(app)
        .get('/health')
        .expect(200, { status: 'OK' }, done);
    });
  });

  describe('GET /ss', () => {
    it('responds with an OK status when app and sub-systems are responding', () => {
      sinon.stub(requestPromise, 'get')
        .returns(Promise.resolve({ status: 'OK' }));

      return request(app)
        .get('/health/ss')
        .expect(200)
        .then((response) => {
          expect(response.body.status, 'OK');
        });
    });

    it('responds with an error message when sub-system is not responding', (done) => {
      sinon.stub(requestPromise, 'get')
        .throws('RequestError');

      request(app)
        .get('/health/ss')
        .expect(500, {
          message: 'An internal server error occurred',
          error: 'Internal Server Error',
          statusCode: 500,
        }, done);
    });

    afterEach(() => {
      requestPromise.get.restore();
    });
  });

  describe('GET /cache', () => {
    it('responds with an OK status', (done) => {
      request(app)
        .get('/health/cache')
        .expect(200, done);
    });
  });
});
