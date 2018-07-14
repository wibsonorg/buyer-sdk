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
    expect(response.result).to.eq('f9014a8230308082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa823030b8e4e0ffe8e3000000000000000065794a685a3255694f69497a4d4334754d7a556966513d3d000000000000000000000000000000000067656f6c6f63616c697a6174696f6e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000054264300000000000000000000000000000068747470733a2f2f62757965722e636f6d3238316232306435303930633364656533316337316435653865633237303363824be6a04b3a3daf9502bfebabe093d6088c0e84cfe589b8a4b88b0f08a6b8bc82179a4fa07c3fac7b366318db736c2df435dd9e0ffb4800edf4b894b330006dfb82196f08');
  });

  it('responds with error when none of payload or parameters is present');

  it('responds successfully when payload is present', () => {
    const newOrderPayload = 'asdasdasd';
    const response = signNewOrderFacade({
      nonce,
      newOrderPayload,
    });

    expect(response.success()).to.eq(true);
    expect(response.result).to.eq('f9014a8230308082753094f3b435d66a6156622e1b3c1a974d25cdbf6032aa823030b8e4e0ffe8e30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003238316232306435303930633364656533316337316435653865633237303363824be5a07d2dfa1a71645017759d8f21fd282bec72565377dbfbc21ea81a398807132194a016c6591fb3bf574f02eb0ac8f84b515b2561342f344425aeacbb563aaeab0ef7');
  });
});
