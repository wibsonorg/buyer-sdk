/* eslint-disable no-param-reassign */
import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { createIdentity } from 'eth-crypto';
import { AESencrypt } from '../../src/utils/wibson-lib/cryptography/encription';
import { encryptWithPublicKey } from '../../src/utils/wibson-lib/cryptography/ec-encription';

export const sellerAddress = 'aselleraddress';

const { publicKey, privateKey } = createIdentity();
export const buyerPrivateKey = privateKey;
export const buyerPublicKey = publicKey;
export const masterKey = '12342ec7-b8ce-4e21-804d-e05e1ac0';
export const data = {
  google: {
    id: 1, name: 'Someone',
  },
};

export const initialRawData = {
  '123dddd': data,
};

export const getData = sinon.spy(() => encryptWithPublicKey(buyerPublicKey, JSON.stringify(data)));
export const safeGetRawOrderData = sinon.spy(() => initialRawData);
export const putRawOrderData = sinon.spy(() => undefined);

td.replace('../../src/utils/wibson-lib/s3', {
  getData,
  safeGetRawOrderData,
  putRawOrderData,
});

export const fakeNotarization = {
  notarizationId: 'notid1243',
  result: {
    sellers: [{
      address: sellerAddress,
      decryptionKeyEncryptedWithMasterKey: AESencrypt(masterKey, buyerPrivateKey),
    }],
  },
  request: {
    orderId: 'orderid123',
  },
  masterKey,
};

export const job = {
  id: 'jobid123',
  data: {
    notarizationId: fakeNotarization.notarizationId,
  },
};

export const fakeOrderUUID = 'some-data-order-uuid';

export const notarizations = { fetch: sinon.spy(() => fakeNotarization) };
export const dataOrders = { fetchByDxId: sinon.spy(() => ({ id: fakeOrderUUID })) };
export const fakeQueue = { process: sinon.stub(), on: sinon.stub(), add: sinon.spy() };
const createQueue = sinon.stub().returns(fakeQueue);

td.replace('../../src/utils/stores', {
  notarizations, dataOrders,
});

td.replace('../../src/queues/createQueue', { createQueue });

export function prepareTests() {
  test.beforeEach(() => {
    sinon.reset();
  });
  test.after(() => {
    td.reset();
  });
}
