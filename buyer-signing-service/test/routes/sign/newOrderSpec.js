import request from 'supertest';
import app from '../../../src/app';

describe('/sign', () => {
  const nonce = 0;
  const gasPrice = 10000;
  const filters = {
    age: '30..35',
  };
  const dataRequest = 'geolocalization';
  const price = 20;
  const initialBudgetForAudits = 10;
  const termsAndConditions = 'T&C';
  const buyerURL = 'https://buyer.com';

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
        .expect(200, { rawTransaction: '0xasdasdasdasd' }, done);
    });
  });
});
