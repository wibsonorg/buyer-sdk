import signingService from '../../services/signingService';
import notaryService from '../../services/notaryService';
import { getNotaryInfo } from '../notariesFacade';
import { web3, dataOrderAt } from '../../utils';
import config from '../../../config';

// notarization hack
const demandAuditsFrom = JSON.parse(config.notary.demandAuditsFrom) || [];
const notariesToDemandAuditsFrom = demandAuditsFrom.map(n => n.toLowerCase());

/**
 * @async
 * @param {String} order DataOrder's ethereum address
 * @param {String} seller Seller's ethereum address
 * @param {Function} enqueueTransaction function to enqueue a transaction
 */
const closeDataResponse = async (order, seller, enqueueTransaction) => {
  if (!web3.utils.isAddress(order) || !web3.utils.isAddress(seller)) {
    throw new Error('Invalid order|seller address');
  }

  const dataOrder = dataOrderAt(order);

  const sellerInfo = await dataOrder.methods.getSellerInfo(seller).call();
  if (web3.utils.hexToUtf8(sellerInfo[5]) !== 'DataResponseAdded') {
    return true; // DataResponse has already been closed.
  }

  const notaryAddress = sellerInfo[1];
  const notaryInfo = await getNotaryInfo(notaryAddress);
  const notaryApi = notaryInfo.publicUrls.api;

  const buyer = await dataOrder.methods.buyer().call();
  const account = await signingService.getAccount();

  if (buyer.toLowerCase() !== account.address.toLowerCase()) {
    return false;
  }

  if (notariesToDemandAuditsFrom.includes(notaryAddress.toLowerCase())) {
    await notaryService.demandAudit(notaryApi, order, seller, buyer);
  }

  const params = await notaryService.auditResult(notaryApi, order, seller, buyer);

  enqueueTransaction(account, 'CloseDataResponse', params, config.contracts.gasPrice.fast);

  return true;
};

export { closeDataResponse };
