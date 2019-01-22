import { createDataOrder } from './createDataOrder';

import { getBuyerInfo } from '../services/buyerInfo';
import { dataOrders } from '../utils/stores';
import { addTransactionJob } from '../queues/transactionQueue';

jest.mock('uuid/v4', () => ({
  __esModule: true,
  default: jest.fn(() => 'uuid'),
}));
jest.mock('../utils/wibson-lib/coin', () => ({
  fromWib: jest.fn(() => 'wibTokens'),
}));
jest.mock('../services/buyerInfo', () => ({
  getBuyerInfo: jest.fn(async () => ({ termsHash: '0xSomeHash' })),
}));
jest.mock('../utils/stores', () => ({
  dataOrders: { put: jest.fn() },
}));
jest.mock('../queues/transactionQueue', () => ({
  addTransactionJob: jest.fn(),
}));

const someDataOrder = {
  price: 333,
  audience: { age: 42 },
  requestedData: ['geolocation'],
  buyerInfoId: 'someBuyerInfoId',
  buyerUrl: 'someBuyerUrl',
};

describe('createDataOrder', () => {
  it('sets id and status', async () => {
    const { id, status } = await createDataOrder(someDataOrder);
    expect(id).toBe('uuid');
    expect(status).toBe('creating');
  });

  it('adds 0x to termsHash if its missing', async () => {
    getBuyerInfo.mockReturnValueOnce({ termsHash: 'SomeOtherHash' });
    await createDataOrder(someDataOrder);
    expect(addTransactionJob.mock.calls[0][1].termsAndConditionsHash).toBe('0xSomeOtherHash');
  });

  it('stores data order', async () => {
    await createDataOrder(someDataOrder);
    expect(dataOrders.put.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  "uuid",
  Object {
    "audience": Object {
      "age": 42,
    },
    "buyerInfoId": "someBuyerInfoId",
    "buyerUrl": "someBuyerUrl/orders/uuid",
    "price": 333,
    "requestedData": Array [
      "geolocation",
    ],
    "status": "creating",
    "termsAndConditionsHash": "0xSomeHash",
  },
]
`);
  });

  it('adds transaction job', async () => {
    await createDataOrder(someDataOrder);
    expect(addTransactionJob.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  "NewOrder",
  Object {
    "audience": "{\\"age\\":42}",
    "buyerUrl": "someBuyerUrl/orders/uuid",
    "price": "wibTokens",
    "requestedData": "[\\"geolocation\\"]",
    "termsAndConditionsHash": "0xSomeHash",
  },
]
`);
  });
});
