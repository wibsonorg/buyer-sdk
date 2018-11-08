import request from 'supertest';
import { storeBuyerInfo } from '../../../src/services';
import web3 from '../../../src/utils/web3';
import { mockStorage, restoreMocks, requireApp } from '../../helpers';

describe('/orders', () => {
  let app;
  const buyerInfoId = 'social-good';
  let notaries = [];

  const dataOrder = {
    filters: {
      age: '30..35',
      gender: 'male',
    },
    dataRequest: 'data request',
    price: 20,
    initialBudgetForAudits: 10,
    termsAndConditions: 'DataOrder T&C',
    buyerURL: 'https://buyer.example.com/data',
    buyerInfoId,
    notaries,
  };

  beforeEach(function (done) { // eslint-disable-line func-names
    this.timeout(5000);
    mockStorage();
    app = requireApp();

    web3.eth.getAccounts().then(res => { notaries = [res[5], res[6]] });
    storeBuyerInfo(buyerInfoId, {
      id: buyerInfoId,
      label: 'Social Good',
      description: 'Social Good $ Research',
      category: {
        id: 'research-social-good',
        label: 'Social Good & Research',
        description: 'Social Good & more Research',
      },
      terms: '# WIBSON ALPHA TERMS OF USE',
    }).then(done);
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

    it('responds with an OK status', (done) => {
      request(app)
        .post('/authentication')
        .send({ password: 'pass' })
        .expect(200)
        .then((response) => {
          request(app)
            .post('/orders')
            .set('Authorization', `Bearer ${response.body.token}`)
            .send({ dataOrder })
            .expect(200, done);
        });
    });
  });
});
