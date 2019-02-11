import request from 'supertest';
import config from '../../../config';
import app from '../../../src/app';

describe('POST /sign/bat-pay/transfer', () => {
  const nonce = 0;
  const gasPrice = 100000;
  const amount = 100;
  const fee = 1;
  const payData = '0x6964313b696432';
  const newCount = 0;
  const roothash = '0x468e49a01f8bc984472a1991b383c90731f114c042a6a1c39959c774d45028f4';
  const lock = '0x6168652c307c1e813ca11cfb3a601f1cf3b22452021a5052d8b05f1f1f8a3e92';
  const metadata = '0x7a9d3a032b8ff274f09714b56ba8e5ed776ec9638ca303069bc3a3267bb22f65';

  beforeEach(() => {
    config.contracts.chainId = 9697;
    config.contracts.BatPay.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.contracts.BatPay.transfer.gasLimit = 30000;
    config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
    config.buyer.id = 20;
  });

  it('responds with an Unprocessable Entity status when amount is not present', (done) => {
    request(app)
      .post('/sign/bat-pay/transfer')
      .send({
        nonce,
        gasPrice,
        params: {
          fee,
          payData,
          newCount,
          roothash,
          lock,
          metadata,
        },
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Operation failed',
        errors: ['Field \'amount\' is required'],
      }, done);
  });

  it('responds with an Unprocessable Entity status when fee is not present');
  it('responds with an Unprocessable Entity status when payData is not present');
  it('responds with an Unprocessable Entity status when newCount is not present');
  it('responds with an Unprocessable Entity status when roothash is not present');
  it('responds with an Unprocessable Entity status when lock is not present');
  it('responds with an Unprocessable Entity status when metadata is not present');

  it('responds with an OK status', (done) => {
    request(app)
      .post('/sign/bat-pay/transfer')
      .send({
        nonce,
        gasPrice,
        params: {
          amount,
          fee,
          payData,
          newCount,
          roothash,
          lock,
          metadata,
        },
      })
      .expect(200, { signedTransaction: 'f901aa80830186a082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b9014412d403d300000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000468e49a01f8bc984472a1991b383c90731f114c042a6a1c39959c774d45028f46168652c307c1e813ca11cfb3a601f1cf3b22452021a5052d8b05f1f1f8a3e927a9d3a032b8ff274f09714b56ba8e5ed776ec9638ca303069bc3a3267bb22f6500000000000000000000000000000000000000000000000000000000000000076964313b69643200000000000000000000000000000000000000000000000000824be6a0c1f90459f1a1895a18fb3d0b2e528365f9a92029bce73c15ddc96dcd87607abba0308669118c48a84f24fbe66ada23b8bc5f5b8fa84e9e8d617c321b94f368d880' }, done);
  });
});
