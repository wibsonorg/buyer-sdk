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

/**
 * It creates a signed and encrypted message.
 * @param {string} senderPrivateKey Ethereum private key of the sender account.
 * @param {string} targetPublicKey Ethereum public key of the target account.
 * @param {string} message the message to encrypt.
 * @public
 */
const encryptSignedMessage = (senderPrivateKey, targetPublicKey, message) => {
  assert(senderPrivateKey && targetPublicKey, 'Keys must exist');

  const signature = hashAndSignMessage(senderPrivateKey, message);

  // 2. we create the payload with the message and the signature
  const payload = JSON.stringify({ message, signature });

  // 3. we encrypt the payload
  return encryptWithPublicKey(targetPublicKey, payload);
};

/**
 * It decrypts a signed message, checking it is from the expected sender.
 * @param {string} senderAddress Sender's ethereum address.
 * @param {string} targetPublicKey Ethereum public key of the target account.
 * @param {string} encrypted the signed message to decrypt.
 * @public
 */
const decryptSignedMessage = (senderAddress, targetPrivateKey, encrypted) => {
  assert(senderAddress && targetPrivateKey, 'Keys must exist');

  // 1. we decrypt the payload
  const decrypted = decryptWithPrivateKey(targetPrivateKey, encrypted);
  const decryptedPayload = JSON.parse(decrypted);

  // 3. we check the signature is from the expected sender
  const messageHash = ethCrypto.hash.keccak256(decryptedPayload.message);
  const recoveredAddress = ethCrypto.recover(decryptedPayload.signature, messageHash);

  assert(
    recoveredAddress.toLowerCase() === senderAddress.toLowerCase(),
    'The message is not from the expected address',
  );

  return decryptedPayload.message;
};

export { encryptSignedMessage, decryptSignedMessage, encryptWithPublicKey, hashAndSignMessage };
