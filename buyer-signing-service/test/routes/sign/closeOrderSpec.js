import request from 'supertest';
import app from '../../../src/app';

describe('/sign/close-order', () => {
  const nonce = 0;
  const orderAddr = '0xa662a5c63079009d79740f4e638a404f7917f93a';
  const gasPrice = 1000000000; // 1 gwei
  const account = { number: 0 };

  describe('POST /', () => {
    it('responds with an Unprocessable Entity status when nonce is not present');
    it('responds with an Unprocessable Entity status when orderAddr is not present');

    it('responds with an OK status', (done) => {
      request(app)
        .post('/sign/close-order')
        .send({
          account,
          gasPrice,
          nonce,
          params: {
            orderAddr,
          },
        })
        .expect(200, { signedTransaction: 'f88780843b9aca008094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80a490e72127000000000000000000000000a662a5c63079009d79740f4e638a404f7917f93a824be6a02becd9d580e3a7c0368cb6c1751d8a3711d80f5e985d921627dc4a9e247a91c2a0172625dbaa084b83a116aed9acac440d49c6c1fbae1bdf92777f4f591f0cb635' }, done);
    });
  });
});
