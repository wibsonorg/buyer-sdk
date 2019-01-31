import request from 'supertest';
import config from '../../../config';
import app from '../../../src/app';

describe('POST /sign/create-data-order', () => {
  const nonce = 0;
  const gasPrice = 100000;
  const audience = 'eyJhZ2UiOiIzMC4uMzUifQ==';
  const requestedData = 'geolocalization';
  const price = 20;
  const termsAndConditionsHash = '0x123456';
  const buyerUrl = 'https://buyer.com/orders/123asd';

  beforeEach(() => {
    config.contracts.chainId = 9697;
    config.contracts.dataExchange.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.contracts.dataExchange.createDataOrder.gasLimit = 30000;
    config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
  });

  it('responds with an Unprocessable Entity status when nonce is not present', (done) => {
    request(app)
      .post('/sign/create-data-order')
      .send({
        gasPrice,
        params: {
          audience,
          requestedData,
          price,
          termsAndConditionsHash,
          buyerUrl,
        },
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
      .post('/sign/create-data-order')
      .send({
        nonce,
        params: {
          audience,
          requestedData,
          price,
          termsAndConditionsHash,
          buyerUrl,
        },
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
      .post('/sign/create-data-order')
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

  it('responds with an Unprocessable Entity status when audience is not present', (done) => {
    request(app)
      .post('/sign/create-data-order')
      .send({
        nonce,
        gasPrice,
        params: {
          requestedData,
          price,
          termsAndConditionsHash,
          buyerUrl,
        },
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Operation failed',
        errors: ['Field \'audience\' is required'],
      }, done);
  });

  it('responds with an Unprocessable Entity status when requestedData is not present', (done) => {
    request(app)
      .post('/sign/create-data-order')
      .send({
        nonce,
        gasPrice,
        params: {
          audience,
          price,
          termsAndConditionsHash,
          buyerUrl,
        },
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Operation failed',
        errors: ['Field \'requestedData\' is required'],
      }, done);
  });

  it('responds with an Unprocessable Entity status when price is not present', (done) => {
    request(app)
      .post('/sign/create-data-order')
      .send({
        nonce,
        gasPrice,
        params: {
          audience,
          requestedData,
          termsAndConditionsHash,
          buyerUrl,
        },
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Operation failed',
        errors: ['Field \'price\' is required'],
      }, done);
  });

  it('responds with an Unprocessable Entity status when termsAndConditionsHash is not present', (done) => {
    request(app)
      .post('/sign/create-data-order')
      .send({
        nonce,
        gasPrice,
        params: {
          audience,
          requestedData,
          price,
          buyerUrl,
        },
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Operation failed',
        errors: ['Field \'termsAndConditionsHash\' is required'],
      }, done);
  });

  it('responds with an Unprocessable Entity status when buyerUrl is not present', (done) => {
    request(app)
      .post('/sign/create-data-order')
      .send({
        nonce,
        gasPrice,
        params: {
          audience,
          requestedData,
          price,
          termsAndConditionsHash,
        },
      })
      .expect(422, {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Operation failed',
        errors: ['Field \'buyerUrl\' is required'],
      }, done);
  });

  it('responds with an OK status', (done) => {
    request(app)
      .post('/sign/create-data-order')
      .send({
        nonce,
        gasPrice,
        params: {
          audience,
          requestedData,
          price,
          termsAndConditionsHash,
          buyerUrl,
        },
      })
      .expect(200, { signedTransaction: 'f901ca80830186a082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b901645ca849ef00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000e012345600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000001865794a685a3255694f69497a4d4334754d7a556966513d3d0000000000000000000000000000000000000000000000000000000000000000000000000000000f67656f6c6f63616c697a6174696f6e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f68747470733a2f2f62757965722e636f6d2f6f72646572732f31323361736400824be6a0e1642cf17e64ba8aac397b2f9953efe12bd1af11980dd6fd78f1ab0147cb4ed8a01affd67b44924674da58b1488079e3a27f4bf638d104f2cae3510acfccd0c23a' }, done);
  });
});
