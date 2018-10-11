import request from 'supertest';
import { mockStorage, restoreMocks, requireApp } from '../../helpers';

describe.skip('/orders', () => {
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
    app = requireApp();
    done();
  });

  afterEach(() => {
    restoreMocks();
  });

  describe('POST /', () => {
    it('responds with an Unprocessable Entity status when filters is not present');
    it('responds with an Unprocessable Entity status when dataRequest is not present');
    it('responds with an Unprocessable Entity status when price is not present');
    it('responds with an Unprocessable Entity status when initialBudgetForAudits is not present');
    it('responds with an Unprocessable Entity status when termsAndConditions is not present');

    // eslint-disable-next-line func-names
    it('responds with an OK status', function (done) {
      this.timeout(60 * 1000);

      request(app)
        .post('/orders')
        .send({
          dataOrder: {
            ...dataOrder,
            buyerURL: 'https://buyer.example.com/data',
          },
        })
        .expect(200, done);
    });
  });
});
