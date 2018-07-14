import { expect } from 'chai';
import web3 from '../../src/utils/web3';
import signingService from '../../src/services/signingService';
import dataOrderFacade from '../../src/facades/dataOrderFacade';

describe.only('dataOrderFacade', () => {
  const filters = { age: '30..35' };
  const dataRequest = 'asd';
  const price = '20';
  const initialBudgetForAudits = '10';
  const termsAndConditions = 'asd';
  const buyerURL = 'asd';

  it('responds with error if filters is not present', async () => {
    const response = await dataOrderFacade({
      filters,
      dataRequest,
      price,
      initialBudgetForAudits,
      termsAndConditions,
      buyerURL,
    });

    expect(response.success()).to.eq(true);
  });
  it('responds with error if dataRequest is not present');
  it('responds with error if price is not present');
  it('responds with error if initialBudgetForAudits is not present');
  it('responds with error if termsAndConditions is not present');
  it('responds with error if buyerURL is not present');
  it('responds successfully');
});
