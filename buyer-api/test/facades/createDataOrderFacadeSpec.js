import { expect } from 'chai';
import sinon from 'sinon';
import signingService from '../../src/services/signingService';
import web3 from '../../src/utils/web3';
import { createDataOrderFacade } from '../../src/facades';

describe.skip('createDataOrderFacade', () => {
  const filters = { age: '30..35' };
  const dataRequest = 'data request';
  const price = 20;
  const initialBudgetForAudits = 10;
  const termsAndConditions = 'asd';
  const buyerURL = 'asd';

  beforeEach(async () => {
    // TODO:
    //   * Token Allowance: dx contract allowance is being set outside the test
    //     suite. It should be set here.
    //   * Buyer SS is not being mock for now.
  });

  it('responds with error if filters is not present');
  it('responds with error if dataRequest is not present');
  it('responds with error if price is not present');
  it('responds with error if initialBudgetForAudits is not present');
  it('responds with error if termsAndConditions is not present');
  it('responds with error if buyerURL is not present');
  it('responds successfully', async () => {
    sinon.stub(signingService, 'getAccount')
      .returns(Promise.resolve(JSON.stringify({
        address: '0xaddress',
        publicKey: '0xpublickey',
      })));
    sinon.stub(signingService, 'signNewOrder')
      .returns(Promise.resolve(JSON.stringify({
        signedTransaction: 'asdasd',
      })));

    sinon.stub(web3.eth, 'getTransactionCount')
      .returns(Promise.resolve(2));
    sinon.stub(web3.eth, 'sendRawTransaction')
      .returns(Promise.resolve('0xtxhash'));
    sinon.stub(web3.eth, 'getTransactionReceipt')
      .returns(Promise.resolve(JSON.stringify({
        logs: [], // fails because of this
      })));

    const response = await createDataOrderFacade({
      filters,
      dataRequest,
      price,
      initialBudgetForAudits,
      termsAndConditions,
      buyerURL,
    });

    expect(response.success()).to.eq(true);

    signingService.getAccount.restore();
    signingService.signNewOrder.restore();
    web3.eth.getTransactionCount.restore();
    web3.eth.sendRawTransaction.restore();
    web3.eth.getTransactionReceipt.restore();
  });
});
