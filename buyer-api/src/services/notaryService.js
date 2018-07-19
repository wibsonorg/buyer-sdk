import client from 'request-promise-native';

/**
 * We are not going to wait the service to respond mora than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 1000;

const consent = async (url, { buyerAddress, orderAddress }) => {
  const {
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    signature,
  } = await client.get(
    `${url}/audit/consent/${buyerAddress}/${orderAddress}`,
    {
      timeout,
    },
  );

  return {
    orderAddr: orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    notarySignature: signature,
  };
};

export default { consent };
