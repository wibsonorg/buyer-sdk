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
    config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
  });

  describe('POST /new-order', () => {
    it('responds with an Unprocessable Entity status when nonce is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          newOrderParameters: {
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
            "Field 'nonce' is required",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when filters is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          newOrderParameters: {
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
            "Field 'filters' is required",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when dataRequest is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          newOrderParameters: {
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
            "Field 'dataRequest' is required",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when price is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          newOrderParameters: {
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
            "Field 'price' is required",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when initialBudgetForAudits is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          newOrderParameters: {
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
            "Field 'initialBudgetForAudits' is required",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when termsAndConditions is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          newOrderParameters: {
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
            "Field 'termsAndConditions' is required",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when buyerURL is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          newOrderParameters: {
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
            "Field 'buyerURL' is required",
          ],
        }, done);
    });

    it('responds with an OK status', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          newOrderParameters: {
            filters,
            dataRequest,
            price,
            initialBudgetForAudits,
            termsAndConditions,
            buyerURL,
          },
        })
        .expect(200, { signedTransaction: 'f902e5808082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b90284e0ffe8e300000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000001865794a685a3255694f69497a4d4334754d7a556966513d3d0000000000000000000000000000000000000000000000000000000000000000000000000000000f67656f6c6f63616c697a6174696f6e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035426430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001168747470733a2f2f62757965722e636f6d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008036353832633033353936623264653265363736383261353266633735656665353737343036353130393634623435376332623264313039633664303433346636626631343432333834346166633739386364646135663131393262616166623732383162323064353039306333646565333163373164356538656332373033631ca041ff1cb842c3c29842895f4b81ad2358d3b43357a11b8f1019b295042d6fe820a0140851d6c881e8c15aff598adc6813c50c1e99b6aaceadba45005a3e47d1e1bf' }, done);
    });
  });
});
