/* eslint-disable no-param-reassign */
import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { AESencrypt } from '../../src/utils/wibson-lib/cryptography/encription';
import { /* encryptWithPublicKey, */ getPublic } from '../../src/utils/wibson-lib/cryptography/ec-encription';

export const sellerAddress = 'aselleraddress';
export const buyerPrivateKey = '3ec12ec7-b8ce-4e21-804d-e05e1ac0';
export const buyerPublicKey = getPublic(buyerPrivateKey);
export const masterKey = '12342ec7-b8ce-4e21-804d-e05e1ac0';
export const data = {
  google: {
    id: 1, name: 'Someone',
  },
};

// TODO: use eliptic curves when ready
// const getData = sinon.spy(() => encryptWithPublicKey(buyerPublicKey, JSON.stringify(data)));
export const getData = sinon.spy(() => AESencrypt(buyerPrivateKey, JSON.stringify(data)));
export const getRawOrderData = sinon.spy(() => undefined); // TODO: check real return value
export const putRawOrderData = sinon.spy(() => undefined);

td.replace('../../src/utils/wibson-lib/s3', {
  getData,
  getRawOrderData,
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
  orderId: 'orderid123',
  masterKey,
};

export const job = {
  id: 'jobid123',
  data: {
    notarizationId: fakeNotarization.notarizationId,
  },
};
export const notarizations = { fetch: sinon.spy(() => fakeNotarization) };
export const fakeQueue = { process: sinon.stub(), on: sinon.stub(), add: sinon.spy() };
const createQueue = sinon.stub().returns(fakeQueue);


td.replace('../../src/utils/stores', {
  notarizations,
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

