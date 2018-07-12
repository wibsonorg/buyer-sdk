import { expect } from 'chai';
import newOrderFacade from '../../../src/facades/sign/newOrderFacade';

describe('signNewOrderFacade', () => {
  const transactionParameters = {
    nonce: 0,
    gasPrice: 10000,
    filters: {
      age: '30..35',
    },
    dataRequest: 'geolocalization',
    price: 20,
    initialBudgetForAudits: 10,
    termsAndConditions: 'T&C',
    buyerURL: 'https://buyer.com',
    publicKey: 'public-key',
  };

  it('response with error if nonce is not present', () => {
    const response = newOrderFacade({
      gasPrice: 1000,
      transactionParameters,
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'nonce\' is required');
  });
  it('response with error if gasPrice is not present');
  it('response with error if filters is not present');
  it('response with error if dataRequest is not present');
  it('response with error if price is not present');
  it('response with error if initialBudgetForAudits is not present');
  it('response with error if termsAndConditions is not present');
  it('response with error if buyerURL is not present');
  it('response successfully');
});
