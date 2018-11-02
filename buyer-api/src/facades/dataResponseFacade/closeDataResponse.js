import client from 'request-promise-native';
import signingService from '../../services/signingService';
import { getNotaryInfo } from '../notariesFacade';
import { web3, dataOrderAt } from '../../utils';
import config from '../../../config';

// notarization hack
const demandAuditsFrom = JSON.parse(config.notary.demandAuditsFrom) || [];
const notariesToDemandAuditsFrom = demandAuditsFrom.map(n => n.toLowerCase());

const buildUri = (rootUrl, path) => {
  const baseUri = rootUrl.replace(/\/$/, '');
  const trimmedPath = path.replace(/^\//, '');
  return `${baseUri}/${trimmedPath}`;
};

const postAudit = async (notaryUrl, order, seller, buyer, step) => {
  const auditUrl = buildUri(notaryUrl, `buyers/audit/${step}/${buyer}/${order}`);
  const payload = { dataResponses: [{ seller }] };
  const response = await client.post(auditUrl, { json: payload, timeout: 1000 });
  return response.dataResponses[0];
};

const demandAudit = async (notaryUrl, order, seller, buyer) => {
  const { error } = await postAudit(notaryUrl, order, seller, buyer, 'on-demand');
  if (error) {
    throw new Error(error);
  }
};

const auditResult = async (notaryUrl, order, seller, buyer) => {
  const { error, result, signature } = await postAudit(notaryUrl, order, seller, buyer, 'result');

  if (error) {
    throw new Error(error);
  }

  if (result === 'in-progress') {
    throw new Error('Audit result is in progress');
  }

  const wasAudited = result === 'success' || result === 'failure';
  const isDataValid = result === 'success';
  const notarySignature = signature;

  return {
    orderAddr: order,
    seller,
    wasAudited,
    isDataValid,
    notarySignature,
  };
};

/**
 * @async
 * @param {String} order DataOrder's ethereum address
 * @param {String} seller Seller's ethereum address
 * @param {Function} enqueueTransaction function to enqueue a transaction
 */
const closeDataResponse = async (
  order,
  seller,
  enqueueTransaction,
) => {
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

  if (notariesToDemandAuditsFrom.includes(notaryAddress.toLowerCase())) {
    await demandAudit(notaryApi, order, seller, buyer);
  }

  const params = await auditResult(notaryApi, order, seller, buyer);

  const account = await signingService.getAccount();

  enqueueTransaction(
    account,
    'signCloseDataResponse',
    params,
    config.contracts.gasPrice.fast,
    { priority: 10 },
  );

  return true;
};

export { closeDataResponse };
