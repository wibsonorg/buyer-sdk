import request from 'supertest';
import app from '../../../src/app';

const createUnprocessableEntityError = (prop, message) => ({
  message,
  statusCode: 422,
  error: 'Unprocessable Entity',
  errors: [`Field '${prop}' is required`],
});

export function testEndpointInput(endpoint, inputParams, {
  signedTransaction, gasPrice = 100000, nonce = 0,
}) {
  const payload = { nonce, gasPrice, params: inputParams };
  it('responds with an OK status', () =>
    request(app)
      .post(endpoint)
      .send(payload)
      .expect(200, { signedTransaction }));

  Object.keys(payload).forEach((prop) => {
    const { [prop]: value, ...uncompletePayload } = payload;
    it(`responds with an Unprocessable Entity status when ${prop} is not present`, () =>
      request(app)
        .post(endpoint)
        .send(uncompletePayload)
        .expect(422, createUnprocessableEntityError(prop, 'Missing parameters')));
  });

  Object.keys(inputParams).forEach((prop) => {
    const { [prop]: value, ...uncompleteParams } = inputParams;
    it(`responds with an Unprocessable Entity status when ${prop} is not present`, () =>
      request(app)
        .post(endpoint)
        .send({ nonce, gasPrice, params: uncompleteParams })
        .expect(422, createUnprocessableEntityError(prop, 'Operation failed')));
  });
}
