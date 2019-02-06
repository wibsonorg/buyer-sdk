import client from 'request-promise-native';

/**
 * We are not going to wait the service to respond mora than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 10000;

export const consent = async (url, { buyerAddress, orderAddress }) => {
  const result = await client.get(
    `${url}/buyers/audit/consent/${buyerAddress}/${orderAddress}`,
    {
      timeout,
    },
  );

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

export const notarize = async (url, id, payload) =>
  client.post(
    `${url}/request-notarization/${id}`,
    {
      json: payload,
      timeout,
    },
  );

export default { consent, notarize };
