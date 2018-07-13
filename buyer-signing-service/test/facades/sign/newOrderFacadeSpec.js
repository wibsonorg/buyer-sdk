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

  const transactionParameters = {
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
    config.buyer.privateKey = '0x74bd05949189ec1974b8fc366008dc853ca75d7dd5f32534d29d3f4260422b96';
  });

  it('responds with error if nonce is not present', () => {
    const response = signNewOrderFacade({ transactionParameters });

    expect(response.success()).to.eq(false);
    expect(response.errors.length).to.eq(1);
    expect(response.errors[0]).to.eq('Field \'nonce\' is required');
  });

  it('responds with error if filters is not present', () => {
    const response = signNewOrderFacade({
      nonce,
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
    const response = signNewOrderFacade({
      nonce,
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
    const response = signNewOrderFacade({
      nonce,
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
    const response = signNewOrderFacade({
      nonce,
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
    const response = signNewOrderFacade({
      nonce,
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
    const response = signNewOrderFacade({
      nonce,
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
    const response = signNewOrderFacade({
      nonce,
      transactionParameters,
    });

    expect(response.success()).to.eq(true);
    expect(response.result).to.eq('f901488082753082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa80b8e4e0ffe8e3000000000000000065794a685a3255694f69497a4d4334754d7a556966513d3d000000000000000000000000000000000067656f6c6f63616c697a6174696f6e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000054264300000000000000000000000000000068747470733a2f2f62757965722e636f6d6363646466613533663662653262393832323630643866396664313062323165824be5a0af00bc0bb0de1ee4049e4d170132b5e72fd1d407e21b0f1c24dbafceeb63157fa0380f004aca13fcd01213043d3f3f03442275b48189299282bae2c213c6525b91');
  });
});
