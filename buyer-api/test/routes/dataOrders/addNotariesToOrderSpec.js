import request from 'supertest';
import sinon from 'sinon';
import signingService from '../../../src/services/signingService';
import web3 from '../../../src/utils/web3';
import { mockStorage, restoreMocks, requireApp } from '../../helpers';

describe('/orders/:orderAddress/notaries', () => {
  let app;
  const ownerAddress = web3.eth.accounts[0];
  const buyerAddress = web3.eth.accounts[1];
  const notaryA = {
    notaryAddress: web3.eth.accounts[6],
    responsesPercentage: 30,
    notarizationFee: 10,
    notarizationTermsOfService: 'Terms A',
    notarySignature: 'signature',
  };
  const notaryB = {
    notaryAddress: web3.eth.accounts[7],
    responsesPercentage: 50,
    notarizationFee: 20,
    notarizationTermsOfService: 'Terms B',
    notarySignature: 'signature',
  };

  const orderAddress = '0xa662a5c63079009d79740f4e638a404f7917f93a';
  const notaries = [notaryA, notaryB];

  beforeEach(function (done) { // eslint-disable-line func-names
    this.timeout(5000);
    mockStorage();
    app = requireApp();

    // sinon.stub(signingService, 'getAccount')
    //   .returns(Promise.resolve(JSON.stringify({
    //     address: '0xaddress',
    //     publicKey: '0xpublickey',
    //   })));

    done();
  });

  afterEach(() => {
    restoreMocks();
    // signingService.getAccount.restore();
  });

  describe('POST /', () => {
    it('responds with an Not Found status when orderAddress is not present');
    it('responds with an Unprocessable Entity status when notary is not present');
    it('responds with an Unprocessable Entity status when responsesPercentage is not present');
    it('responds with an Unprocessable Entity status when notarizationFee is not present');
    it('responds with an Unprocessable Entity status when notarizationTermsOfService is not present');
    it('responds with an Unprocessable Entity status when notarySignature is not present');

    it.only('responds with an OK status', (done) => {
      request(app)
        .post(`/orders/${orderAddress}/notaries`)
        .send({
          notaries,
        })
        .expect(200, {
          orderAddress,
          notariesAddresses: notaries,
        }, done);
    });
  });
});
