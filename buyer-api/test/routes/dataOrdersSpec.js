import request from 'supertest';
import config from '../../config';
import { mockStorage, restoreMocks } from '../helpers';
import web3 from '../../src/utils/web3';
import getContracts from '../../src/contracts';

describe('/data-orders', () => {
  let app;
  let dataExchange;
  let dataToken;
  const buyerAddress = web3.eth.accounts[0];

  const {
    dataExchange: dataExchangeAddress,
    dataToken: dataTokenAddress,
  } = config.contracts.addresses;

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

  beforeEach(async function () { // eslint-disable-line func-names
    this.timeout(5000);
    mockStorage();
    app = require('../../src/app'); // eslint-disable-line global-require
    const contracts = await getContracts({ web3, dataExchangeAddress, dataTokenAddress });
    dataExchange = contracts.dataExchange;
    dataToken = contracts.dataToken;
    await dataToken.approve(dataExchange.address, 3000, { from: buyerAddress });
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
