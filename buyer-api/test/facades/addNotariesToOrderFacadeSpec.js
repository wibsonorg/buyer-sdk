import { expect } from 'chai';
import { addNotariesToOrderFacade } from '../../src/facades';

describe('addNotariesToOrderFacade', () => {
  const orderAddress = '0xa662a5c63079009d79740f4e638a404f7917f93a';
  const notaries = [];

  it('responds with error when orderAddress is not present');
  it('responds with error when notary is not present');
  it('responds with error when responsesPercentage is not present');
  it('responds with error when notarizationFee is not present');
  it('responds with error when notarizationTermsOfService is not present');
  it('responds with error when notarySignature is not present');

  it('responds successfully', async () => {
    const response = await addNotariesToOrderFacade(
      orderAddress,
      notaries,
      {},
    );

    expect(response.success()).to.eq(true);
  });
});
