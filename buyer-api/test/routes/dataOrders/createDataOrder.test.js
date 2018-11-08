import test from 'ava';
import request from 'supertest';
import { storeBuyerInfo } from '../../../src/services';
import { web3 } from '../../../src/utils';

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

test.before(async () => {
  app = require('../../../src/app'); // eslint-disable-line global-require
  const accounts = await web3.eth.getAccounts();
  notaries = [accounts[5], accounts[6]];
  await storeBuyerInfo(buyerInfoId, {
    id: buyerInfoId,
    label: 'Social Good',
    description: 'Social Good $ Research',
    category: {
      id: 'research-social-good',
      label: 'Social Good & Research',
      description: 'Social Good & more Research',
    },
    terms: '# WIBSON ALPHA TERMS OF USE',
  });
});

test.skip('responds with an Unprocessable Entity status when filters is not present', t => t.fail());
test.skip('responds with an Unprocessable Entity status when dataRequest is not present', t => t.fail());
test.skip('responds with an Unprocessable Entity status when price is not present', t => t.fail());
test.skip('responds with an Unprocessable Entity status when initialBudgetForAudits is not present', t => t.fail());
test.skip('responds with an Unprocessable Entity status when termsAndConditions is not present', t => t.fail());

test('POST / responds with an OK status', (t) => {
  request(app)
    .post('/authentication')
    .send({ password: 'pass' })
    .expect(200)
    .then((response) => {
      request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${response.body.token}`)
        .send({ dataOrder })
        .expect(200, t.pass());
    });
});
