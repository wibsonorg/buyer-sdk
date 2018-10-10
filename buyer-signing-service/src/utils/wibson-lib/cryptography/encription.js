import CryptoJS from 'crypto-js';
import elliptic from 'elliptic';
import ethCrypto from 'eth-crypto';
import { removeLeading0x } from '../coercion';

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
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

/**
 * It decrypts a message.
 * @param {string} targetPublicKey Ethereum public key of the target account.
 * @param {string} encrypted the signed message to decrypt.
 * @public
 */
const decryptWithPrivateKey = async (targetPrivateKey, encrypted) => {
  const { cipher, ephemPublicKey } = JSON.parse(Buffer.from(encrypted, 'base64').toString());

  const twoStripped = removeLeading0x(targetPrivateKey);
  const privateKey = Buffer.from(twoStripped, 'hex');

  const px = derive(privateKey, Buffer.from(ephemPublicKey, 'hex'));
  const encryptionKey = CryptoJS.SHA512(px.toString('hex')).toString().slice(0, 32);

  const bytes = CryptoJS.AES.decrypt(cipher, encryptionKey);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);

  return plaintext;
};

/**
 * It decrypts a signed message, checking it is from the expected sender.
 * @param {string} senderAddress Sender's ethereum address.
 * @param {string} targetPublicKey Ethereum public key of the target account.
 * @param {string} encrypted the signed message to decrypt.
 * @public
 */
const decryptSignedMessage = async (senderAddress, targetPrivateKey, encrypted) => {
  assert(senderAddress && targetPrivateKey, 'Keys must exist');

  // 1. we decrypt the payload
  const decrypted = await decryptWithPrivateKey(targetPrivateKey, encrypted);
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

export { decryptSignedMessage };
