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
        .expect(200, { signedTransaction: 'f9014a8230308082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa823030b8e4e0ffe8e3000000000000000065794a685a3255694f69497a4d4334754d7a556966513d3d000000000000000000000000000000000067656f6c6f63616c697a6174696f6e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000054264300000000000000000000000000000068747470733a2f2f62757965722e636f6d3238316232306435303930633364656533316337316435653865633237303363824be5a0adfc79e7495204897c740dd67f9230d7a6f7428c0bf8ffcc78f36a77028e6ef3a009a3f4ae99382bc8df071f72ea2cb8600241dcd26a7168ff5134c14a31a662ea' }, done);
    });

    it('responds with error when none of payload or parameters is present');

    it('responds successfully when payload is present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          nonce,
          newOrderPayload: 'qweqweqweqwe',
        })
        .expect(200, { signedTransaction: 'f9014a8230308082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa823030b8e4e0ffe8e30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003238316232306435303930633364656533316337316435653865633237303363824be5a0023185bfd46b7fb4e236c61ec5b4db7dff8d389d5001be0abaae922853d38431a01c8ba340b067acff7ab7d827d422afae994faf4894b04052dd042b245fcda3e1' }, done);
    });
  });
});
