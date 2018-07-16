import { expect } from 'chai';
import config from '../../../config';
import signNewOrderFacade from '../../../src/facades/sign/newOrderFacade';

describe('signNewOrderFacade', () => {
  const nonce = 0;
  const filters = 'eyJhZ2UiOiIzMC4uMzUifQ==';
  const dataRequest = 'geolocalization';
  const price = 20;
  const initialBudgetForAudits = 10;
  const termsAndConditions = 'T&C';
  const buyerURL = 'https://buyer.com';

  const newOrderParameters = {
    filters,
    dataRequest,
    price,
    initialBudgetForAudits,
    termsAndConditions,
    buyerURL,
  };

  beforeEach(() => {
    config.contracts.chainId = 9697;
    config.contracts.dataExchange.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.contracts.dataExchange.newOrder.gasLimit = 30000;
    config.buyer.privateKey = '400d7c600656f71e792b3c583a7a05080252005ccc34ef380cc793e0d2069140';
  });

  it('responds with error if nonce is not present', () => {
    const response = signNewOrderFacade({ newOrderParameters });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'nonce\' is required');
  });

  it('responds with error if filters is not present', () => {
    const response = signNewOrderFacade({
      nonce,
      newOrderParameters: {
        dataRequest,
        price,
        initialBudgetForAudits,
        termsAndConditions,
        buyerURL,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'filters\' is required');
  });

  it('responds with error if dataRequest is not present', () => {
    const response = signNewOrderFacade({
      nonce,
      newOrderParameters: {
        filters,
        price,
        initialBudgetForAudits,
        termsAndConditions,
        buyerURL,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'dataRequest\' is required');
  });

  it('responds with error if price is not present', () => {
    const response = signNewOrderFacade({
      nonce,
      newOrderParameters: {
        filters,
        dataRequest,
        initialBudgetForAudits,
        termsAndConditions,
        buyerURL,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'price\' is required');
  });

  it('responds with error if initialBudgetForAudits is not present', () => {
    const response = signNewOrderFacade({
      nonce,
      newOrderParameters: {
        filters,
        dataRequest,
        price,
        termsAndConditions,
        buyerURL,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'initialBudgetForAudits\' is required');
  });

  it('responds with error if termsAndConditions is not present', () => {
    const response = signNewOrderFacade({
      nonce,
      newOrderParameters: {
        filters,
        dataRequest,
        price,
        initialBudgetForAudits,
        buyerURL,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'termsAndConditions\' is required');
  });

  it('responds with error if buyerURL is not present', () => {
    const response = signNewOrderFacade({
      nonce,
      newOrderParameters: {
        filters,
        dataRequest,
        price,
        initialBudgetForAudits,
        termsAndConditions,
      },
    });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'buyerURL\' is required');
  });

  it('responds successfully', () => {
    const response = signNewOrderFacade({
      nonce,
      newOrderParameters,
    });

    expect(response.success()).to.eq(true);
    expect(response.result).to.eq('f902e5808082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b90284e0ffe8e300000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000001865794a685a3255694f69497a4d4334754d7a556966513d3d0000000000000000000000000000000000000000000000000000000000000000000000000000000f67656f6c6f63616c697a6174696f6e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035426430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001168747470733a2f2f62757965722e636f6d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008036353832633033353936623264653265363736383261353266633735656665353737343036353130393634623435376332623264313039633664303433346636626631343432333834346166633739386364646135663131393262616166623732383162323064353039306333646565333163373164356538656332373033631ca00d93f2ef31bdcf90f606cd3d10f8168adf2f68d3ba20a9d978da294a3f3bc94ca02c70b03445f822491e090748386d7d56f4df4a0fd5056dd16c36266a0ece7ad3');
  });
});
