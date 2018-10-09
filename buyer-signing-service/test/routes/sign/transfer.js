import request from 'supertest';
import app from '../../../src/app';

describe('/sign/transfer', () => {
  const nonce = 0;
  const gasPrice = 1000000000; // 1 gwei
  const account = { number: 'root' };

  describe('POST /wib', () => {
    it('responds with an Unprocessable Entity status when _to is not present', (done) => {
      request(app)
        .post('/sign/transfer/wib')
        .send({
          account,
          nonce,
          gasPrice,
          params: {
            _value: '1000000000000000000',
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Operation failed',
          errors: ['Field \'_to\' is required'],
        }, done);
    });

    it('responds with an Unprocessable Entity status when _value is not present', (done) => {
      request(app)
        .post('/sign/transfer/wib')
        .send({
          account,
          nonce,
          gasPrice,
          params: {
            _to: '0x0a6c070ae42d7b5c2c17b4d9c8243da2c8d8b3cc',
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Operation failed',
          errors: ['Field \'_value\' is required'],
        }, done);
    });

    it('responds with an OK status', (done) => {
      request(app)
        .post('/sign/transfer/wib')
        .send({
          account,
          nonce,
          gasPrice,
          params: {
            _to: '0x0a6c070ae42d7b5c2c17b4d9c8243da2c8d8b3cc',
            _value: '1000000000000000000',
          },
        })
        .expect(200, { signedTransaction: 'f8ab80843b9aca00830186a094d518cd50e83b8c3fe28543a287fc00c0bc8c9de180b844a9059cbb0000000000000000000000000a6c070ae42d7b5c2c17b4d9c8243da2c8d8b3cc0000000000000000000000000000000000000000000000000de0b6b3a7640000824be6a080af771cbae4fa5ba47205b7c21a78d9cae663a8bab7e2bb8d4696f7d6a16892a067051a7725006229d026e3e402e3e68f50ce3f01d4547ac04a3e61ed75b6eee8' }, done);
    });
  });

  describe('POST /eth', () => {
    it('responds with an Unprocessable Entity status when _to is not present', (done) => {
      request(app)
        .post('/sign/transfer/eth')
        .send({
          account,
          nonce,
          gasPrice,
          params: {
            _value: '1000000000000000000',
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Operation failed',
          errors: ['Field \'_to\' is required'],
        }, done);
    });

    it('responds with an Unprocessable Entity status when _value is not present', (done) => {
      request(app)
        .post('/sign/transfer/eth')
        .send({
          account,
          nonce,
          gasPrice,
          params: {
            _to: '0x0a6c070ae42d7b5c2c17b4d9c8243da2c8d8b3cc',
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Operation failed',
          errors: ['Field \'_value\' is required'],
        }, done);
    });

    it('responds with an OK status', (done) => {
      request(app)
        .post('/sign/transfer/eth')
        .send({
          account,
          nonce,
          gasPrice,
          params: {
            _to: '0x0a6c070ae42d7b5c2c17b4d9c8243da2c8d8b3cc',
            _value: '1000000000000000000',
          },
        })
        .expect(200, { signedTransaction: 'f86e80843b9aca00830186a0940a6c070ae42d7b5c2c17b4d9c8243da2c8d8b3cc880de0b6b3a764000080824be6a0cfbd3f1885d313502fc37a2fa44e31aa2cd3874fabb3d34b46aed3827f172b40a01c2c6f05a09b3250cd12bfec5dd9d78daba357edcf888879e14ad2e91fa89284' }, done);
    });
  });
});
