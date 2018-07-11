import request from 'supertest';
import { mockStorage, restoreMocks } from '../helpers';

describe('/data-orders', () => {
  let app;

  const dataOrder = {
    buyerAddress: 'buyer address',
    filters: 'age:20,gender:male',
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

  describe.only('POST /', () => {
    it('responds with an Unprocessable Entity status when buyerUrl is not present', (done) => {
      request(app)
        .post('/data-orders')
        .send({ ...dataOrder, buyerPublicKey: 'public-key' })
        .expect(422, { status: 'unprocessable_entity' }, done);
    });

    it('responds with an Unprocessable Entity status when buyerPublicKey is not present', (done) => {
      request(app)
        .post('/data-orders')
        .send({ ...dataOrder, buyerUrl: 'https://buyer.example.com/data' })
        .expect(422, { status: 'unprocessable_entity' }, done);
    });

    it('responds with an OK status', (done) => {
      request(app)
        .post('/data-orders')
        .send({
          ...dataOrder,
          buyerUrl: 'https://buyer.example.com/data',
          buyerPublicKey: 'public-key',
        })
        .expect(200, done);
    });
  });
});
