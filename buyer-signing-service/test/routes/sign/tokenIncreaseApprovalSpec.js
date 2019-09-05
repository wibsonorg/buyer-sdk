import { testEndpointInput } from './testEndpointInput';

describe('POST /sign/token/increase-approval', () => {
  testEndpointInput('/sign/token/increase-approval', {
    _spender: '0x454287298cf5f597003970ec704af9fada173207',
    _addedValue: 100,
  }, {
    signedTransaction: 'f8a980830186a082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b844d73dd623000000000000000000000000454287298cf5f597003970ec704af9fada1732070000000000000000000000000000000000000000000000000000000000000064824be5a04913f5a40dc6fb30201831a2feb53c186ba55c8cc8da2d9c8accb7d13c284589a02ffcbaffc1165ada5baac86c64a2c872d85a3a71fb3c8a165fb9765ed6b9bf69',
  });
});
