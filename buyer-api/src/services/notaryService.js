import client from 'request-promise-native';

/**
 * We are not going to wait the service to respond mora than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 1000;

const conscent = async (url, { buyerAddress, orderAddress }) => {
  const {
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    signature,
  } = client.get(
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
    notarizationSignature: signature,
  };
};

export default { conscent };
