import request from 'supertest';
import { mockStorage, restoreMocks } from '../helpers';
import web3 from '../../src/utils/web3';

describe('/data-orders', () => {
  let app;
  const [buyerAddress] = web3.eth.accounts;

  const dataOrder = {
    buyerAddress,
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
    it('responds with an Unprocessable Entity status when buyerUrl is not present', (done) => {
      request(app)
        .post('/data-orders')
        .send({ ...dataOrder, buyerPublicKey: 'public-key' })
        .expect(422, { status: 'unprocessable_entity' }, done);
    });

    it('responds with an OK status', function (done) { // eslint-disable-line func-names
      this.timeout(120 * 1000);

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
