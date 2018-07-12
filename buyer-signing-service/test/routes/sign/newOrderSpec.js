import request from 'supertest';
import config from '../../../config';
import app from '../../../src/app';

describe('/sign', () => {
  const nonce = 0;
  const gasPrice = 10000;
  const filters = 'eyJhZ2UiOiIzMC4uMzUifQ==';
  const dataRequest = 'geolocalization';
  const price = 20;
  const initialBudgetForAudits = 10;
  const termsAndConditions = 'T&C';
  const buyerURL = 'https://buyer.com';

  beforeEach(() => {
    config.contracts.addresses.dataExchange = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.transactions.newOrder.gasLimit = 30000;
    config.buyer.privateKey = '0x74bd05949189ec1974b8fc366008dc853ca75d7dd5f32534d29d3f4260422b96';
  });

  describe('POST /new-order', () => {
    it('responds with an Unprocessable Entity status when nonce is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          gasPrice,
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

    it('responds with an Unprocessable Entity status when gasPrice is not present', (done) => {
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
        .expect(422, {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          validation: [
            "Field 'gasPrice' is mandatory",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when filters is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          gasPrice,
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
          gasPrice,
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
          gasPrice,
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
          gasPrice,
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
          gasPrice,
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
          gasPrice,
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
          gasPrice,
          transactionParameters: {
            filters,
            dataRequest,
            price,
            initialBudgetForAudits,
            termsAndConditions,
            buyerURL,
          },
        })
        .expect(200, { signedTransaction: 'f901468082271082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b8e4e0ffe8e3000000000000000065794a685a3255694f69497a4d4334754d7a556966513d3d000000000000000000000000000000000067656f6c6f63616c697a6174696f6e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000054264300000000000000000000000000000068747470733a2f2f62757965722e636f6d63636464666135336636626532623938323236306438663966643130623231651ca06d8a6068b583b2d2722d6fedbb414cfcaa8ca0ed2906341f0d7cbfdf8d6c2a55a04c8133bd61ccd7dc936221f490dcc693a6e36fa094a283e870699ad67a302ad8' }, done);
    });
  });
});
