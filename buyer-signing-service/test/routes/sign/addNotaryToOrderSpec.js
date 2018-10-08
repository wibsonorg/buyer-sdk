import request from 'supertest';
import app from '../../../src/app';

describe('/sign/add-notary-to-order', () => {
  const nonce = 0;
  const orderAddr = '0xa662a5c63079009d79740f4e638a404f7917f93a';
  const notary = '0x5ee6fd4d54540333c148885d52e81f39c256761a';
  const responsesPercentage = 30;
  const notarizationFee = 10;
  const notarizationTermsOfService = 'Terms A';
  const notarySignature = '0x7369676e6174757265';
  const gasPrice = 1000000000; // 1 gwei
  const account = { number: 'root' };

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
          account,
          gasPrice,
          nonce,
          params: {
            orderAddr,
            notary,
            responsesPercentage,
            notarizationFee,
            notarizationTermsOfService,
            notarySignature,
          },
        })
        .expect(200, { signedTransaction: 'f901a980843b9aca008094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b901449e2d0478000000000000000000000000a662a5c63079009d79740f4e638a404f7917f93a0000000000000000000000005ee6fd4d54540333c148885d52e81f39c256761a000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000075465726d7320410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000097369676e61747572650000000000000000000000000000000000000000000000824be6a07e7142d1501d2c1c2976374449f16310e00bd9058210333f22db8ade2aa14e94a04a2179fe1607ac994d0a4561527eb75556593963b320f5cc4d331ddc84e136a9' }, done);
    });
  });
});
