import { notaries } from '../utils/stores';

/**
 * @async
 * @function getNotaryInfo
 * @param {String} address the notary's ethereum address.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the notary's information.
 */
const getNotaryInfo = async (address) => notaries.fetch(address);

/**
 * @async
 * @function getNotariesInfo
 * @param {Array} addresses specific notary addresses to fetch.
 * @throws When can not connect to blockchain or cache is not set up correctly.
 * @returns {Promise} Promise which resolves to the list with the notaries' information.
 */
const getNotariesInfo = async () => notaries.list();

/**
 * @function getNotarizationRequest
 * @param {String} notarizationId the notarization request Id.
 *
 * @returns {Object} Notarization request Object.
 */
const getNotarizationRequest = (notarizationId) => {
  if (notarizationId === '0x87c2d362de99f75a4f2755cdaaad2d11bf6cc65dc71356593c445535ff28f43d') {
    return {
      orderId: 114,
      callbackUrl: 'http://api.wibson.org/notarization-result/0x87c2d362de99f75a4f2755cdaaad2d11bf6cc65dc71356593c445535ff28f43d',
      sellers: [
        {
          id: 78,
          address: '0x338fff484061da07323e994990c901d322b6927a',
          decryptionKeyHash: '0x32f2ab2ab2157408e0d8e8af2677f628ec82b5fc9329facb8fcc71cfb8f0b92e',
        },
        {
          id: 84,
          address: '0x2d419c641352e0baa7f54328ecabf58c5e4a56f1',
          decryptionKeyHash: '0x15e4d58cc37f15f2de3e688b4a21e5b5caa5263f9dd47db2011d8643cc59779f',
        },
      ],
    };
  }
  return null;
};

export { getNotaryInfo, getNotariesInfo, getNotarizationRequest };
