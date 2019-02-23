import request from 'supertest';
import config from '../../../config';
import app from '../../../src/app';

describe('POST /sign/token/increase-approval', () => {
  const nonce = 0;
  const gasPrice = 100000;
  const _addedValue = 100;
  const _spender = '0x454287298cf5f597003970ec704af9fada173207';

  beforeEach(() => {
    config.contracts.chainId = 9697;
    config.contracts.Wibcoin.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.contracts.Wibcoin.increaseApproval.gasLimit = 30000;
    config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
    config.buyer.id = 20;
  });

  it('responds with an Unprocessable Entity status when addedValue is not present', (done) => {
    request(app)
      .post('/sign/token/increase-approval')
      .send({
        nonce,
        gasPrice,
        params: { _spender },
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Operation failed',
        errors: ['Field \'_addedValue\' is required'],
      }, done);
  });

  it('responds with an OK status', (done) => {
    request(app)
      .post('/sign/token/increase-approval')
      .send({
        nonce,
        gasPrice,
        params: { _addedValue, _spender },
      })
      .expect(200, { signedTransaction: 'f8a980830186a082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b844d73dd623000000000000000000000000454287298cf5f597003970ec704af9fada1732070000000000000000000000000000000000000000000000000000000000000064824be5a04913f5a40dc6fb30201831a2feb53c186ba55c8cc8da2d9c8accb7d13c284589a02ffcbaffc1165ada5baac86c64a2c872d85a3a71fb3c8a165fb9765ed6b9bf69' }, done);
  });
});
