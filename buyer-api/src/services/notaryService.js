import client from 'request-promise-native';

/**
 * We are not going to wait the service to respond mora than `timeout`
 * milisseconds.
 * @type {Number}
 */
const timeout = 10000;

export const notarize = async (url, id, payload) => client.post(url, { json: payload, timeout });
