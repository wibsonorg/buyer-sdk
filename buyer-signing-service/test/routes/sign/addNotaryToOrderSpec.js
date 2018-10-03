import request from 'supertest';
import config from '../../../config';
import app from '../../../src/app';

describe('/sign/add-notary-to-order', () => {
  const nonce = 0;
  const orderAddr = '0xa662a5c63079009d79740f4e638a404f7917f93a';
  const notary = '0x5ee6fd4d54540333c148885d52e81f39c256761a';
  const responsesPercentage = 30;
  const notarizationFee = 10;
  const notarizationTermsOfService = 'Terms A';
  const notarySignature = '0x7369676e6174757265';

  beforeEach(() => {
    config.contracts.chainId = 9697;
    config.contracts.dataExchange.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.contracts.dataExchange.addNotaryToOrder.gasLimit = 30000;
    config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
  });

  describe('POST /', () => {
    it('responds with an Unprocessable Entity status when nonce is not present');
    it('responds with an Unprocessable Entity status when orderAddress is not present');
    it('responds with an Unprocessable Entity status when notary is not present');
    it('responds with an Unprocessable Entity status when responsesPercentage is not present');
    it('responds with an Unprocessable Entity status when notarizationFee is not present');
    it('responds with an Unprocessable Entity status when notarizationTermsOfService is not present');
    it('responds with an Unprocessable Entity status when notarySignature is not present');

    it('responds with an OK status', (done) => {
      request(app)
        .post('/sign/add-notary-to-order')
        .send({
          nonce,
          addNotaryToOrderParameters: {
            orderAddr,
            notary,
            responsesPercentage,
            notarizationFee,
            notarizationTermsOfService,
            notarySignature,
          },
        })
        .expect(200, { signedTransaction: 'f901a5808082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b901449e2d0478000000000000000000000000a662a5c63079009d79740f4e638a404f7917f93a0000000000000000000000005ee6fd4d54540333c148885d52e81f39c256761a000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000075465726d7320410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000097369676e617475726500000000000000000000000000000000000000000000001ca04d110fcabcf1c06ae15f45d3485b75ae73a0f7ecd86041b056f170b7307c659ea0482fbfb8506fdfbc3cea9d57d3671a38e848ed409abf0213ff3b86b73656855e' }, done);
    });
  });
});
