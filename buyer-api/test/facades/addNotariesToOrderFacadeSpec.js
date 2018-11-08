import { expect } from 'chai';
import { addNotariesToOrderFacade } from '../../src/facades';

const noop = () => false;

describe('addNotariesToOrderFacade', () => {
  const orderAddress = '0xa662a5c63079009d79740f4e638a404f7917f93a';
  const notaries = [];

  it('responds with error when orderAddress is not present');
  it('responds with error when notaries is not present', async () => {
    const response = await addNotariesToOrderFacade(
      orderAddress,
      notaries,
      noop,
    );

    expect(response.success()).to.eq(false);
  });
  it('responds with error when responsesPercentage is not present');
  it('responds with error when notarizationFee is not present');
  it('responds with error when notarizationTermsOfService is not present');
  it('responds with error when notarySignature is not present');
  it('responds successfully');
});
