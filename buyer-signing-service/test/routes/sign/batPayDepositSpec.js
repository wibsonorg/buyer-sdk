import request from 'supertest';
import config from '../../../config';
import app from '../../../src/app';

describe('POST /sign/bat-pay/deposit', () => {
  const nonce = 0;
  const gasPrice = 100000;
  const amount = 100;

  beforeEach(() => {
    config.contracts.chainId = 9697;
    config.contracts.BatPay.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.contracts.BatPay.deposit.gasLimit = 30000;
    config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
    config.buyer.id = 20;
  });

  it('responds with an Unprocessable Entity status when amount is not present', (done) => {
    request(app)
      .post('/sign/bat-pay/deposit')
      .send({
        nonce,
        gasPrice,
        params: {},
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Operation failed',
        errors: ['Field \'amount\' is required'],
      }, done);
  });

  it('responds with an OK status', (done) => {
    request(app)
      .post('/sign/bat-pay/deposit')
      .send({
        nonce,
        gasPrice,
        params: { amount },
      })
      .expect(200, { signedTransaction: 'f8a980830186a082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b8446170c4b100000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000014824be5a04efedfe094db464ef4690389fc00e190ed159f8f4371e6c84e8adcf8b2ef97f2a00706bf907be39c51e5247947023ba2ee297ba9168f7b9efa2d09209361cb3fad' }, done);
  });
});
