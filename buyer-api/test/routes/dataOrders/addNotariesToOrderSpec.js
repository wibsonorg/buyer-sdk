import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import notaryService from '../../../src/services/notaryService';
import web3 from '../../../src/utils/web3';
import config from '../../../config';
import { cryptography } from '../../../src/utils/wibson-lib';
import { WibcoinContract, DataExchangeContract } from '../../../src/utils/contracts';
import { createDataOrderFacade } from '../../../src/facades';
import {
  // TODO: This mocking solution is not working
  // mockStorage,
  // restoreMocks,
  requireApp,
} from '../../helpers';

const { signPayload } = cryptography;

describe.only('POST /orders/:orderAddress/notaries', () => {
  let app;
  let token;
  let dataExchange;
  let orderAddress;
  let notaryServiceConsent;
  let notaryAConsentResponse;
  let notaryBConsentResponse;

  const owner = web3.eth.accounts[0];
  const buyer = web3.eth.accounts[1];
  const notaryA = web3.eth.accounts[6];
  const notaryB = web3.eth.accounts[7];
  const notariesAddresses = [notaryA, notaryB];

  beforeEach(async function () { // eslint-disable-line func-names
    this.timeout(5000);
    // mockStorage();
    app = requireApp();

    config.contracts.addresses.wibcoin = '0x60b2a4f49ef7538a5b5806247c0f62eb39353742';
    config.contracts.addresses.dataExchange = '0xb5532fa50322a92e401cda24893cc6ee455ede0c';
    token = WibcoinContract.at(config.contracts.addresses.wibcoin);
    dataExchange = DataExchangeContract.at(config.contracts.addresses.dataExchange);
    await token.approve(dataExchange.address, 30000, { from: buyer });
    await dataExchange.registerNotary(notaryA, 'A', JSON.stringify({
      api: 'https://api.notary-a.com',
      storage: 'https://storage.notary-a.com',
    }), 'A Public Key', { from: owner, gas: 2000000 });
    await dataExchange.registerNotary(notaryB, 'B', JSON.stringify({
      api: 'https://api.notary-b.com',
      storage: 'https://storage.notary-b.com',
    }), 'B Public Key', { from: owner, gas: 2000000 });

    const facadeResponse = await createDataOrderFacade({
      filters: { age: '20' },
      dataRequest: 'data request',
      price: 20,
      initialBudgetForAudits: 10,
      termsAndConditions: 'DataOrder T&C',
      buyerURL: {
        api: 'https://api.buyer.com',
        storage: 'https://storage.buyer.com',
      },
    }, dataExchange);
    // eslint-disable-next-line prefer-destructuring
    orderAddress = facadeResponse.result.orderAddress;

    app.locals.contracts.dataExchange = dataExchange;

    notaryAConsentResponse = {
      notary: notaryA,
      orderAddr: orderAddress,
      responsesPercentage: 30,
      notarizationFee: 10,
      notarizationTermsOfService: 'Terms A',
      notarySignature: signPayload('0x414da185dc5989c39360066ad194275252ac2521ef96e18a5be0c88b3cf0484c', orderAddress, 30, 10, 'Terms A'),
    };

    notaryBConsentResponse = {
      notary: notaryB,
      orderAddr: orderAddress,
      responsesPercentage: 50,
      notarizationFee: 20,
      notarizationTermsOfService: 'Terms B',
      notarySignature: signPayload('0x5e2995a62dc7989e485323cbe6dc654601ef74b17a77d2c760a61a994d7432e5', orderAddress, 50, 20, 'Terms B'),
    };

    notaryServiceConsent = sinon.stub(notaryService, 'consent');
    notaryServiceConsent.onFirstCall()
      .returns(Promise.resolve(notaryAConsentResponse));
    notaryServiceConsent.onSecondCall()
      .returns(Promise.resolve(notaryBConsentResponse));
  });

  afterEach(() => {
    // restoreMocks();
    notaryServiceConsent.restore();
  });

  it('responds with an Not Found status when orderAddress is not present');
  it('responds with an Unprocessable Entity status when notary is not present');
  it('responds with an Unprocessable Entity status when responsesPercentage is not present');
  it('responds with an Unprocessable Entity status when notarizationFee is not present');
  it('responds with an Unprocessable Entity status when notarizationTermsOfService is not present');
  it('responds with an Unprocessable Entity status when notarySignature is not present');

  it('responds with an OK status when every notary is added successfully', (done) => {
    request(app)
      .post(`/orders/${orderAddress}/notaries`)
      .send({ notariesAddresses })
      .expect(200, {
        orderAddress,
        notariesAddresses,
      }, done);
  });

  context('when an error occurrs during the process of one notary', () => {
    beforeEach(() => {
      const method = sinon.stub(web3.eth, 'sendRawTransaction');
      method.onFirstCall().throws('revert');
      method.onSecondCall().returns('0xfb4b732393acd9fb7094a596f2a96546db0be939799c3d62dca8049c0237b030');
    });

    afterEach(() => {
      web3.eth.sendRawTransaction.restore();
    });

    it('responds with an Internal Server Error status', () => request(app)
      .post(`/orders/${orderAddress}/notaries`)
      .send({ notariesAddresses })
      .expect(500)
      .then((response) => {
        expect(response.body.errors.length).to.eq(1); // Check for content
      }));
  });
});
