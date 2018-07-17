import request from 'supertest';
import { mockStorage, restoreMocks, requireApp } from '../../helpers';

describe('/data-orders/:orderAddress/notaries', () => {
  let app;
  const orderAddress = '0xa662a5c63079009d79740f4e638a404f7917f93a';
  const notaries = [];

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
    it('responds with an Not Found status when orderAddress is not present');
    it('responds with an Unprocessable Entity status when notaryAddress is not present');
    it('responds with an Unprocessable Entity status when responsesPercentage is not present');
    it('responds with an Unprocessable Entity status when notarizationFee is not present');
    it('responds with an Unprocessable Entity status when notarizationTermsOfService is not present');
    it('responds with an Unprocessable Entity status when notarySignature is not present');

    // eslint-disable-next-line func-names
    it('responds with an OK status', function (done) {
      this.timeout(60 * 1000);

      request(app)
        .post(`/data-orders/${orderAddress}/notaries`)
        .send({
          notaries,
        })
        .expect(200, done);
    });
  });
});
