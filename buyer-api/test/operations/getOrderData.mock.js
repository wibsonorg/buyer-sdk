import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const fakeData = {
  someSellerAddress1: {
    'google-profile': {
      email: 'testmobilegd1@gmail.com',
    },
  },
  someSellerAddress2: {
    'google-profile': {
      email: 'testmobilegd2@gmail.com',
    },
  },
  someSellerAddress3: {
    'google-profile': {
      email: 'testmobilegd3@gmail.com',
    },
  },
};

export const getRawOrderData = sinon.stub().returns(fakeData);
td.replace('../../src/utils/wibson-lib/s3', {
  getRawOrderData,
});

test.afterEach(sinon.reset);
