import ethCrypto from 'eth-crypto';

/**
 * It creates a signed and encrypted message.
 * @param {string} senderPrivateKey Ethereum private key of the sender account.
 * @param {string} targetPublicKey Ethereum public key of the target account.
 * @param {string} message the message to encrypt.
 * @public
 */
const encryptSignedMessage = async (senderPrivateKey, targetPublicKey, message) => {
  if (!senderPrivateKey || !targetPublicKey) throw new Error('Keys must exist');

  // 1. we sign the message
  const messageHash = ethCrypto.hash.keccak256(message);
  const signature = ethCrypto.sign(senderPrivateKey, messageHash);

  // 2. we create the payload with the message and the signature
  const payload = {
    message,
    signature,
  };
  const serializedPayload = JSON.stringify(payload);

  // 3. we encrypt the payload
  const encrypted = await ethCrypto.encryptWithPublicKey(targetPublicKey, serializedPayload);

  // 4. we serialize it
  return ethCrypto.cipher.stringify(encrypted);
};

/**
 * It decrypts a signed message, checking it is from the expected sender.
 * @param {string} senderAddress Sender's ethereum address.
 * @param {string} targetPublicKey Ethereum public key of the target account.
 * @param {string} encrypted the signed message to decrypt.
 * @public
 */
const decryptSignedMessage = async (senderAddress, targetPrivateKey, encrypted) => {
  if (!senderAddress || !targetPrivateKey) {
    throw new Error('Sender address and target private key must exist');
  }

  // 1. we deserialize the encrypted payload
  const encryptedObject = ethCrypto.cipher.parse(encrypted);

  // 2. we decrypt the payload
  const decrypted = await ethCrypto.decryptWithPrivateKey(targetPrivateKey, encryptedObject);
  const decryptedPayload = JSON.parse(decrypted);

  // 3. we check the signature is from the expected sender
  const messageHash = ethCrypto.hash.keccak256(decryptedPayload.message);
  const recoveredAddress = ethCrypto.recover(decryptedPayload.signature, messageHash);

  if (recoveredAddress.toLowerCase() !== senderAddress.toLowerCase()) {
    throw new Error('The message is not from the expected address');
  }

  return decryptedPayload.message;
};

export { encryptSignedMessage, decryptSignedMessage };
