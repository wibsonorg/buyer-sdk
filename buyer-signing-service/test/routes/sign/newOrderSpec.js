import request from 'supertest';
import app from '../../../src/app';

describe('/sign', () => {
  const nonce = 0;
  const filters = 'eyJhZ2UiOiIzMC4uMzUifQ==';
  const dataRequest = 'geolocalization';
  const price = 20;
  const initialBudgetForAudits = 10;
  const termsAndConditions = 'T&C';
  const buyerURL = 'https://buyer.com';
  const gasPrice = 1000000000; // 1 gwei
  const account = { number: 'root' };

  describe('POST /new-order', () => {
    it('responds with an Unprocessable Entity status when nonce is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          account,
          gasPrice,
          params: {
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
          message: 'Parameters missing',
          validation: [
            "Field 'nonce' is required",
          ],
        }, done);
    });

    it('responds with an Unprocessable Entity status when filters is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          account,
          gasPrice,
          nonce,
          params: {
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
          message: 'Operation failed',
          errors: ['Field \'filters\' is required'],
        }, done);
    });

    it('responds with an Unprocessable Entity status when dataRequest is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          account,
          gasPrice,
          nonce,
          params: {
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
          message: 'Operation failed',
          errors: ['Field \'dataRequest\' is required'],
        }, done);
    });

    it('responds with an Unprocessable Entity status when price is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          account,
          gasPrice,
          nonce,
          params: {
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
          message: 'Operation failed',
          errors: ['Field \'price\' is required'],
        }, done);
    });

    it('responds with an Unprocessable Entity status when initialBudgetForAudits is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          account,
          gasPrice,
          nonce,
          params: {
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
          message: 'Operation failed',
          errors: ['Field \'initialBudgetForAudits\' is required'],
        }, done);
    });

    it('responds with an Unprocessable Entity status when termsAndConditions is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          account,
          gasPrice,
          nonce,
          params: {
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
          message: 'Operation failed',
          errors: ['Field \'termsAndConditions\' is required'],
        }, done);
    });

    it('responds with an Unprocessable Entity status when buyerURL is not present', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          account,
          gasPrice,
          nonce,
          params: {
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
          message: 'Operation failed',
          errors: ['Field \'buyerURL\' is required'],
        }, done);
    });

    it('responds with an OK status', (done) => {
      request(app)
        .post('/sign/new-order')
        .send({
          account,
          gasPrice,
          nonce,
          params: {
            filters,
            dataRequest,
            price,
            initialBudgetForAudits,
            termsAndConditions,
            buyerURL,
          },
        })
        .expect(200, { signedTransaction: 'f902e980843b9aca008094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b90284e0ffe8e300000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000001865794a685a3255694f69497a4d4334754d7a556966513d3d0000000000000000000000000000000000000000000000000000000000000000000000000000000f67656f6c6f63616c697a6174696f6e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035426430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001168747470733a2f2f62757965722e636f6d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000803865306233353036383730393961353132363336646632343063636634386663616464393161376437323330303333356232626535373631333130643437616361366339373734663065623532653332626439636663663635613230646433353539633862653639613630383162326466373265626135313533346336373336824be6a0339d4eb6dd5548b70324843713898abf60a358e14a7228b0d74f744713788c5da0238b4ffe20244c5c43186e11a72f35c9a7fde173dc451fc96a37b2b85bb34971' }, done);
    });
  });
});
