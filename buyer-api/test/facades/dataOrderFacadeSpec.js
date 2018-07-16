import { expect } from 'chai';
import getContracts from '../../src/contracts';
import web3 from '../../src/utils/web3';
import dataOrderFacade from '../../src/facades/dataOrderFacade';

describe.only('dataOrderFacade', () => {
  const owner = web3.eth.accounts[0];
  const buyerAddress = web3.eth.accounts[3];

  const filters = { age: '30..35' };
  const dataRequest = 'data request';
  const price = 20;
  const initialBudgetForAudits = 10;
  const termsAndConditions = 'asd';
  const buyerURL = 'asd';

  beforeEach(async () => {
    // console.log('aca1');
    // const { dataToken, dataExchange } = await getContracts({
    //   web3,
    //   dataTokenAddress: '0x3962fa1db01e006e73a984e927412d679bb49b10',
    //   dataExchangeAddress: '0x3962fa1db01e006e73a984e927412d679bb49b10',
    // });

    // console.log('aca2', dataExchange.address);
    // try {
    //   await dataExchange.setMinimumInitialBudgetForAudits(10, { from: owner });
    //   console.log('aca3');
    // } catch (error) {
    //   console.log(error);
    // }
    // await dataToken.approve(dataExchange.address, 30000, { from: buyerAddress });
    // console.log('aca4');
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
