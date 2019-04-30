import { testEndpointInput } from './testEndpointInput';

describe('POST /sign/close-data-order', () => {
  testEndpointInput('/sign/close-data-order', {
    orderId: 1,
  }, {
    signedTransaction: 'f88980830186a0831e848094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80a40b59ebd50000000000000000000000000000000000000000000000000000000000000001824be6a0d8972f02214ca7671880e7e22b3bdaec8ac41dd66758119ea7d2e1ab10ace2ada041154c1d94a1373fcd586744e955cbb3261fb64b47f89c7297d4d1b0fe2cb6da',
  });
});
