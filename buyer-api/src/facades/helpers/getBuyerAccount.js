import signingService from '../../services/signingService';

export const getBuyerAccount = async (dataOrder) => {
  const rawFilters = await dataOrder.methods.filters().call();
  const filters = JSON.parse(rawFilters);
  const { ethAddress } = filters;
  return ethAddress && signingService.getAccount(ethAddress.bucketNumber);
};
