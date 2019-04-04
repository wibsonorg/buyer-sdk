import client from 'request-promise-native';

/**
 * We are not going to wait the service to respond more than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 10000;

const buildUri = (rootUrl, path) => {
  const baseUri = rootUrl.replace(/\/$/, '');
  const trimmedPath = path.replace(/^\//, '');
  return `${baseUri}/${trimmedPath}`;
};

const consent = async (url, { buyerAddress, orderAddress }) => {
  const consentUrl = buildUri(url, `buyers/audit/consent/${buyerAddress}/${orderAddress}`);
  const result = await client.get(consentUrl, {
    timeout,
  });

  const {
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    signature,
  } = JSON.parse(result);

  return {
    orderAddr: orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    notarySignature: signature,
  };
};

const postAudit = async (notaryUrl, order, seller, buyer, step, metaData = {}) => {
  const auditUrl = buildUri(notaryUrl, `buyers/audit/${step}/${buyer}/${order}`);
  const payload = { dataResponses: [{ seller }], ...metaData };
  const response = await client.post(auditUrl, { json: payload, timeout });
  return response.dataResponses[0];
};

const demandAudit = async (notaryUrl, order, seller, buyer, freeRide) => {
  const { error } = await postAudit(notaryUrl, order, seller, buyer, 'on-demand', {
    freeRide,
  });
  if (error) {
    throw new Error(error);
  }
};

const auditResult = async (notaryUrl, order, seller, buyer) => {
  const { error, result, signature } = await postAudit(notaryUrl, order, seller, buyer, 'result');

  if (error) {
    throw new Error(error);
  }

  // This is ugly, but as we are trying to prevent a hack ASAP, we are putting the method as-is.
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

export default { consent, demandAudit, auditResult };
