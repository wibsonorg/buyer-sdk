import forge from 'node-forge';
import ethCrypto from 'eth-crypto';
import web3 from 'web3';

import { encodeHashAndSalt, decodeHashAndSalt } from '../encoding';

const hashDataWithSalt = (data, salt) => forge.md.sha256
  .create()
  .update(`${salt}${data}`)
  .digest()
  .toHex();

const saltBytesSize = 32;

const hashData = (data) => {
  try {
    const salt = forge.random.getBytesSync(saltBytesSize);
    const hash = hashDataWithSalt(data, salt);
    return encodeHashAndSalt(hash, salt);
  } catch (error) {
    throw new Error('Unable to hash the data');
  }
};

const checkDataHash = (data, encodedHashAndSalt) => {
  try {
    const hashAndSalt = decodeHashAndSalt(encodedHashAndSalt, saltBytesSize);
    const hash = hashDataWithSalt(data, hashAndSalt.salt);
    return hash === hashAndSalt.hash;
  } catch (error) {
    throw new Error('The data does not match the hash');
  }
};

/* Will calculate the sha3 of given input parameters in the same way solidity would.
 * This means arguments will be ABI converted and tightly packed before being hashed.
 */
const packMessage = (...args) => web3.utils.soliditySha3(...args);

/* Will hash the tightly packed message the solidity way. The data will be
 * UTF-8 HEX decoded and enveloped as follows:
 *    "\x19Ethereum Signed Message:\n" + message.length + message
 * and hashed using keccak256.
 */
const hashMessage = (message) => {
  const byteMessage = web3.utils.isHexStrict(message) ? web3.utils.hexToBytes(message) : message;
  const preamble = `\x19Ethereum Signed Message:\n${byteMessage.length}`;
  const messageBuffer = Buffer.from(byteMessage);
  const preambleBuffer = Buffer.from(preamble);
  const ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
  return web3.utils.keccak256(ethMessage);
};

/* Will sign the keccak256, solidity-compatible message using secp256k1 algorithm.
 */
const signMessage = (privateKey, messageHash) => {
  const pv = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  return ethCrypto.sign(pv, messageHash);
};

const signPayload = (privateKey, ...args) => {
  // 1. We calculate the sha3 of given input parameters in the same way solidity would.
  // This means arguments will be ABI converted and tightly packed before being hashed.
  const argsHash = packMessage(...args);

  // 2. We hash the tightly packed message the solidity way. The data will be
  // UTF-8 HEX decoded and enveloped as follows:
  // "\x19Ethereum Signed Message:\n" + message.length + message
  // and hashed using keccak256.
  const messageHash = hashMessage(argsHash);

  // 3. We sign the keccak256, solidity-compatible message using secp256k1 algorithm.
  return signMessage(privateKey, messageHash);
};

export {
  hashData,
  checkDataHash,
  packMessage,
  hashMessage,
  signMessage,
  signPayload,
};
