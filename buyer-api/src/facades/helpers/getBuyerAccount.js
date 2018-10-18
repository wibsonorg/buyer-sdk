import signingService from '../../services/signingService';

export const getBuyerAccount = async (dataOrder) => {
  const rawFilters = dataOrder.filters();
  const filters = JSON.parse(rawFilters);
  const { ethAddress } = filters;
  return ethAddress && signingService.getAccount(ethAddress.bucketNumber);
};
