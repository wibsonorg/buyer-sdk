import request from 'supertest';
import config from '../../../config';
import app from '../../../src/app';

describe('/sign', () => {
  const nonce = 0;
  const filters = 'eyJhZ2UiOiIzMC4uMzUifQ==';
  const dataRequest = 'geolocalization';
  const price = 20;
  const initialBudgetForAudits = 10;
  const termsAndConditions = 'T&C';
  const buyerURL = 'https://buyer.com';

  beforeEach(() => {
    config.contracts.chainId = 9697;
    config.contracts.dataExchange.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.contracts.dataExchange.newOrder.gasLimit = 30000;
    config.buyer.privateKey = '0x74bd05949189ec1974b8fc366008dc853ca75d7dd5f32534d29d3f4260422b96';
  });

  describe('POST /new-order', () => {
    it('responds with an Unprocessable Entity status when nonce is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          transactionParameters: {
            filters,
            dataRequest,
            price,
            initialBudgetForAudits,
            termsAndConditions,
            buyerURL,
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          validation: [
            "Field 'nonce' is mandatory",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when filters is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          transactionParameters: {
            dataRequest,
            price,
            initialBudgetForAudits,
            termsAndConditions,
            buyerURL,
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          validation: [
            "Field 'filters' is mandatory",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when dataRequest is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          transactionParameters: {
            filters,
            price,
            initialBudgetForAudits,
            termsAndConditions,
            buyerURL,
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          validation: [
            "Field 'dataRequest' is mandatory",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when price is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          transactionParameters: {
            filters,
            dataRequest,
            initialBudgetForAudits,
            termsAndConditions,
            buyerURL,
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          validation: [
            "Field 'price' is mandatory",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when initialBudgetForAudits is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          transactionParameters: {
            filters,
            dataRequest,
            price,
            termsAndConditions,
            buyerURL,
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          validation: [
            "Field 'initialBudgetForAudits' is mandatory",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when termsAndConditions is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          transactionParameters: {
            filters,
            dataRequest,
            price,
            initialBudgetForAudits,
            buyerURL,
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          validation: [
            "Field 'termsAndConditions' is mandatory",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when buyerURL is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          transactionParameters: {
            filters,
            dataRequest,
            price,
            initialBudgetForAudits,
            termsAndConditions,
          },
        })
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          validation: [
            "Field 'buyerURL' is mandatory",
          ],
        }, done);
    });

    it('responds with an OK status', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          transactionParameters: {
            filters,
            dataRequest,
            price,
            initialBudgetForAudits,
            termsAndConditions,
            buyerURL,
          },
        })
        .expect(200, { signedTransaction: 'f901488082271082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b8e4e0ffe8e3000000000000000065794a685a3255694f69497a4d4334754d7a556966513d3d000000000000000000000000000000000067656f6c6f63616c697a6174696f6e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000054264300000000000000000000000000000068747470733a2f2f62757965722e636f6d6363646466613533663662653262393832323630643866396664313062323165824be6a0181c032bcf083fe05471adcd13879426f40dd5eff8815852c4f9cc204dbd0ceda042acabf89877f6d4d54f4c653d3bcfc5aad4881bd36e546540df098c5606f8ef' }, done);
    });
  });
});
