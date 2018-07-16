import request from 'supertest';
import { mockStorage, restoreMocks } from '../helpers';

describe('/data-orders', () => {
  let app;

  const dataOrder = {
    filters: {
      age: '30..35',
      gender: 'male',
    },
    dataRequest: 'data request',
    price: 20,
    initialBudgetForAudits: 10,
    termsAndConditions: 'DataOrder T&C',
  };

  beforeEach(function (done) { // eslint-disable-line func-names
    this.timeout(5000);
    mockStorage();
    app = require('../../src/app'); // eslint-disable-line global-require
    done();
  });

  afterEach(() => {
    restoreMocks();
  });

  describe('POST /', () => {
    it('responds with an OK status', function (done) { // eslint-disable-line func-names
      this.timeout(60 * 1000);

      request(app)
        .post('/data-orders')
        .send({
          ...dataOrder,
          buyerURL: 'https://buyer.example.com/data',
        })
        .expect(200, done);
    });
  });
});
