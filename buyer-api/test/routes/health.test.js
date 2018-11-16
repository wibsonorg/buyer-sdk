import test from 'ava';
import request from 'supertest';

let app;

test.before(() => {
  app = require('../../src/app'); // eslint-disable-line global-require
});

test('GET / should respond with an OK status', (t) => {
  request(app)
    .get('/health')
    .expect(200, { status: 'OK' }, t.pass());
});

test('GET /cache should respond with an OK status', (t) => {
  request(app)
    .get('/cache')
    .expect(200, { status: 'OK' }, t.pass());
});

test('SS: GET /health/ss should respond with an OK status', (t) => {
  request(app)
    .get('/health/ss')
    .expect(200, { status: 'OK' }, t.pass());
});
