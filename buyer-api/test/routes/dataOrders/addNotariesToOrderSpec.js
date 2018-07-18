import request from 'supertest';
import sinon from 'sinon';
import notaryService from '../../../src/services/notaryService';
// import web3 from '../../../src/utils/web3';
import { mockStorage, restoreMocks, requireApp } from '../../helpers';
import { cryptography } from '../../../src/utils/wibson-lib';

describe('/orders/:orderAddress/notaries', () => {
  let app;
  let notaryServiceConscent;
  const orderAddress = '0x9f98a296fa44c4ffad4bb5b61048461599ebf761';
  const notaryA = {
    notary: '0x5ee6fd4d54540333c148885d52e81f39c256761a',
    responsesPercentage: 30,
    notarizationFee: 10,
    notarizationTermsOfService: 'Terms A',
    signature: cryptography.signPayload(
      '0x3164c60ef3e26cb8c1d97effe36777ad8f45341c8b400fda5e5c5f57a9eb12c4',
      orderAddress,
      30,
      10,
      'Terms A',
    ),
  };
  const notaryB = {
    notary: '0x9a8288f6c76a7f37a5d5e2cdd34389f5edbc1d5e',
    responsesPercentage: 50,
    notarizationFee: 20,
    notarizationTermsOfService: 'Terms B',
    signature: cryptography.signPayload(
      '0xe3c01467b44cf99430051cb9d4a48528c51896f5deb2eadf181d71bc7357f4da',
      orderAddress,
      50,
      20,
      'Terms B',
    ),
  };
  const notariesAddresses = [notaryA.notary, notaryB.notary];

  beforeEach(function (done) { // eslint-disable-line func-names
    this.timeout(5000);
    mockStorage();
    app = requireApp();

    notaryServiceConscent = sinon.stub(notaryService, 'conscent');
    notaryServiceConscent.withArgs(notaryA.notary)
      .returns(Promise.resolve(JSON.stringify(notaryA)));
    notaryServiceConscent.withArgs(notaryB.notary)
      .returns(Promise.resolve(JSON.stringify(notaryB)));

    done();
  });

  afterEach(() => {
    restoreMocks();
    notaryServiceConscent.conscent.restore();
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
        .send({ notariesAddresses })
        .expect(422, {
          orderAddress,
          notariesAddresses,
        }, done);
    });
  });
});
