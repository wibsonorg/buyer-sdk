import request from 'supertest';
import config from '../../../config';
import app from '../../../src/app';

describe('POST /sign/close-data-order', () => {
  const nonce = 0;
  const gasPrice = 100000;
  const orderId = 1;

  beforeEach(() => {
    config.contracts.chainId = 9697;
    config.contracts.DataExchange.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.contracts.DataExchange.closeDataOrder.gasLimit = 2000000;
    config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
  });

  it('responds with an Unprocessable Entity status when nonce is not present', (done) => {
    request(app)
      .post('/sign/close-data-order')
      .send({
        gasPrice,
        params: { orderId },
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Missing parameters',
        errors: ['Field \'nonce\' is required'],
      }, done);
  });

  it('responds with an Unprocessable Entity status when gasPrice is not present', (done) => {
    request(app)
      .post('/sign/close-data-order')
      .send({
        nonce,
        params: { orderId },
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Missing parameters',
        errors: ['Field \'gasPrice\' is required'],
      }, done);
  });

  it('responds with an Unprocessable Entity status when params is not present', (done) => {
    request(app)
      .post('/sign/close-data-order')
      .send({
        nonce,
        gasPrice,
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Missing parameters',
        errors: ['Field \'params\' is required'],
      }, done);
  });

  it('responds with an Unprocessable Entity status when requestedData is not present', (done) => {
    request(app)
      .post('/sign/close-data-order')
      .send({
        nonce,
        gasPrice,
        params: {},
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Operation failed',
        errors: ['Field \'orderId\' is required'],
      }, done);
  });

  it('responds with an OK status', (done) => {
    request(app)
      .post('/sign/close-data-order')
      .send({ nonce, gasPrice, params: { orderId } })
      .expect(200, { signedTransaction: 'f88980830186a0831e848094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80a40b59ebd50000000000000000000000000000000000000000000000000000000000000001824be6a0d8972f02214ca7671880e7e22b3bdaec8ac41dd66758119ea7d2e1ab10ace2ada041154c1d94a1373fcd586744e955cbb3261fb64b47f89c7297d4d1b0fe2cb6da' }, done);
  });
});
