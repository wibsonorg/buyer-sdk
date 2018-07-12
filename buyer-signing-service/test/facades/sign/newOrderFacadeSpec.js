import { expect } from 'chai';
import config from '../../../config';
import newOrderFacade from '../../../src/facades/sign/newOrderFacade';

describe('signNewOrderFacade', () => {
  const nonce = 0;
  const gasPrice = 30000;
  const filters = 'eyJhZ2UiOiIzMC4uMzUifQ==';
  const dataRequest = 'geolocalization';
  const price = 20;
  const initialBudgetForAudits = 10;
  const termsAndConditions = 'T&C';
  const buyerURL = 'https://buyer.com';

  const transactionParameters = {
    filters,
    dataRequest,
    price,
    initialBudgetForAudits,
    termsAndConditions,
    buyerURL,
  };

  beforeEach(() => {
    config.contracts.addresses.dataExchange = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
    config.transactions.newOrder.gasLimit = 30000;
    config.buyer.privateKey = '0x74bd05949189ec1974b8fc366008dc853ca75d7dd5f32534d29d3f4260422b96';
  });

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
    expect(response.result).to.eq('f901468082753082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b8e4e0ffe8e3000000000000000065794a685a3255694f69497a4d4334754d7a556966513d3d000000000000000000000000000000000067656f6c6f63616c697a6174696f6e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000054264300000000000000000000000000000068747470733a2f2f62757965722e636f6d63636464666135336636626532623938323236306438663966643130623231651ca0b7ebefa4a499bc8a3bbb12a9036d614af41f1f49c11be1f9dd8884db1ba7929ca06171309ce51598e583d8e10dc332ccc5c487011cb5ab8ba28d020b8018bd9db6');
  });
});
