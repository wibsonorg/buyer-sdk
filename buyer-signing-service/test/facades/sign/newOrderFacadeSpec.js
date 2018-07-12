import { expect } from 'chai';
import newOrderFacade from '../../../src/facades/sign/newOrderFacade';

describe.only('signNewOrderFacade', () => {
  const nonce = 0;
  const gasPrice = 30000;
  const filters = {
    age: '30..35',
  };
  const dataRequest = 'geolocalization';
  const price = 20;
  const initialBudgetForAudits = 10;
  const termsAndConditions = 'T&C';
  const buyerURL = 'https://buyer.com';
  const publicKey = 'public-key';

  const transactionParameters = {
    filters,
    dataRequest,
    price,
    initialBudgetForAudits,
    termsAndConditions,
    buyerURL,
    publicKey,
  };

  it('responds with error if nonce is not present', () => {
    const response = newOrderFacade({
      gasPrice,
      transactionParameters,
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'nonce\' is required');
  });

  it('responds with error if gasPrice is not present', () => {
    const response = newOrderFacade({
      nonce,
      transactionParameters,
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'gasPrice\' is required');
  });

  it('responds with error if filters is not present', () => {
    const response = newOrderFacade({
      nonce,
      gasPrice,
      transactionParameters: {
        dataRequest,
        price,
        initialBudgetForAudits,
        termsAndConditions,
        buyerURL,
        publicKey,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'filters\' is required');
  });

  it('responds with error if dataRequest is not present', () => {
    const response = newOrderFacade({
      nonce,
      gasPrice,
      transactionParameters: {
        filters,
        price,
        initialBudgetForAudits,
        termsAndConditions,
        buyerURL,
        publicKey,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'dataRequest\' is required');
  });

  it('responds with error if price is not present', () => {
    const response = newOrderFacade({
      nonce,
      gasPrice,
      transactionParameters: {
        filters,
        dataRequest,
        initialBudgetForAudits,
        termsAndConditions,
        buyerURL,
        publicKey,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'price\' is required');
  });

  it('responds with error if initialBudgetForAudits is not present', () => {
    const response = newOrderFacade({
      nonce,
      gasPrice,
      transactionParameters: {
        filters,
        dataRequest,
        price,
        termsAndConditions,
        buyerURL,
        publicKey,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'initialBudgetForAudits\' is required');
  });

  it('responds with error if termsAndConditions is not present', () => {
    const response = newOrderFacade({
      nonce,
      gasPrice,
      transactionParameters: {
        filters,
        dataRequest,
        price,
        initialBudgetForAudits,
        buyerURL,
        publicKey,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'termsAndConditions\' is required');
  });

  it('responds with error if buyerURL is not present', () => {
    const response = newOrderFacade({
      nonce,
      gasPrice,
      transactionParameters: {
        filters,
        dataRequest,
        price,
        initialBudgetForAudits,
        termsAndConditions,
        publicKey,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'buyerURL\' is required');
  });

  it('responds successfully', () => {
    const response = newOrderFacade({
      nonce,
      gasPrice,
      transactionParameters,
    });

    expect(response.success()).to.eq(true);
  });
});
