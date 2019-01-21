import { createDataOrder } from './createDataOrder';

jest.mock('uuid/v4', () => ({
  __esModule: true,
  default: jest.fn(() => 'uuid'),
}));
jest.mock('../services/buyerInfo', () => ({
  getBuyerInfo: jest.fn(async () => ({ termsHash: 'someHash' })),
}));
jest.mock('../utils/wibson-lib/coin', () => ({
  fromWib: jest.fn(() => 'wibTokens'),
}));
jest.mock('../utils/stores', () => ({
  dataOrders: { put: jest.fn() },
}));

test('create data order', async (done) => {
  const { id, status } = await createDataOrder({
    price: 333,
    audience: { age: 18 },
    requestedData: ['geolocation'],
    buyerInfoId: 'someBuyerInfoId',
    buyerUrl: 'someBuyerUrl',
  });
  expect(id).toBe('uuid');
  expect(status).toBe('creating');
  done();
});
