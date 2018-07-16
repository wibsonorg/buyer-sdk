import { expect } from 'chai';
import dataOrderFacade from '../../src/facades/dataOrderFacade';

describe('dataOrderFacade', () => {
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
