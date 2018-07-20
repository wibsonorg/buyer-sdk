import request from 'supertest';
import config from '../../../config';
import app from '../../../src/app';

describe('/sign/close-order', () => {
  const nonce = 0;
  const orderAddr = '0xa662a5c63079009d79740f4e638a404f7917f93a';

  beforeEach(() => {
    config.contracts.chainId = 9697;
    config.contracts.dataExchange.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.contracts.dataExchange.closeOrder.gasLimit = 2000000;
    config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
  });

  describe('POST /', () => {
    it('responds with an Unprocessable Entity status when nonce is not present');
    it('responds with an Unprocessable Entity status when orderAddr is not present');

    it('responds with an OK status', (done) => {
      request(app)
        .post('/sign/close-order')
        .send({ nonce, orderAddr })
        .expect(200, { signedTransaction: 'f8848080831e848094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80a490e72127000000000000000000000000a662a5c63079009d79740f4e638a404f7917f93a1ca0ea5ead0993f3032a3764c6cf8ae690d2e3a8974bdd91e263c6c7afcaae29763ca059f8f94e5e477b57aff971eb526be73303063b0928c7712a3b53c38c451e3ad4' }, done);
    });
  });
});
