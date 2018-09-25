import signingService from '../../services/signingService';

export const getBuyerAccount = async (dataOrder) => {
  const rawFilters = dataOrder.filters();
  const filters = JSON.parse(rawFilters);
  const { value: account } = filters.find(({ filter }) => filter === 'bucket');
  return signingService.getAccount(account);
};
