import ethCrypto from 'eth-crypto';
import elliptic from 'elliptic';
import CryptoJS from 'crypto-js';

import { hashCollect } from './hashing';

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

export const getPublic = (privateKey) => {
  assert(privateKey.length === 32, 'Bad private key');
  return Buffer.from(elliptic
    .ec('secp256k1')
    .keyFromPrivate(privateKey)
    .getPublic('arr'));
};

const derive = (privateKeyA, publicKeyB) => {
  assert(Buffer.isBuffer(privateKeyA), 'Bad input');
  assert(Buffer.isBuffer(publicKeyB), 'Bad input');
  assert(privateKeyA.length === 32, 'Bad private key');
  assert(publicKeyB.length === 65, 'Bad public key');
  assert(publicKeyB[0] === 4, 'Bad public key');
  const keyA = elliptic.ec('secp256k1').keyFromPrivate(privateKeyA);
  const keyB = elliptic.ec('secp256k1').keyFromPublic(publicKeyB);
  const Px = keyA.derive(keyB.getPublic());
  return Buffer.from(Px.toArray());
};

const randomBytes = x => Buffer.from(CryptoJS.lib.WordArray.random(x).toString(), 'hex');

const encryptWithPublicKey = (pubKey, msg) => {
  // ensure its an uncompressed publicKey
  const publicKey = ethCrypto.publicKey.decompress(pubKey);

  // re-add the compression-flag
  const pubString = `04${publicKey}`;

  const publicKeyTo = Buffer.from(pubString, 'hex');

  const ephemPrivateKey = randomBytes(32);
  const ephemPublicKey = getPublic(ephemPrivateKey);
  const px = derive(ephemPrivateKey, publicKeyTo);
  const encryptionKey = CryptoJS.SHA512(px.toString('hex'))
    .toString()
    .slice(0, 32);

  const cipher = CryptoJS.AES.encrypt(msg, encryptionKey).toString();

  const payload = Buffer.from(JSON.stringify({ cipher, ephemPublicKey: ephemPublicKey.toString('hex') })).toString('base64');

  return payload;
};

export const decryptWithPrivateKey = (privKey, encrypted) => {
  const { cipher, ephemPublicKey } = JSON.parse(Buffer.from(encrypted, 'base64').toString());

  const privateKey = Buffer.from(privKey.replace(/^0x/, ''), 'hex');

  const px = derive(privateKey, Buffer.from(ephemPublicKey, 'hex'));
  const encryptionKey = CryptoJS.SHA512(px.toString('hex'))
    .toString()
    .slice(0, 32);

  const bytes = CryptoJS.AES.decrypt(cipher, encryptionKey);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);

  return plaintext;
};

/**
 * It signs a keccak256, solidity-compatible message using secp256k1 algorithm.
 * @param {string} privateKey Ethereum private key of an account.
 * @param {string} message The message to sign.
 * @public
 */
const hashAndSignMessage = (privateKey, message) => {
  const pk = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  const hashMessage = hashCollect(message);
  return ethCrypto.sign(pk, hashMessage);
};

export { encryptWithPublicKey, hashAndSignMessage };
