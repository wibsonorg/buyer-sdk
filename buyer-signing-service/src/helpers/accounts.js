import EthCrypto from 'eth-crypto';
import config from '../../config';

const privateKeys = [config.buyer.privateKey];

export const getPrivateKey = account => privateKeys[account];

export const getPublicKey = account =>
  EthCrypto.publicKeyByPrivateKey(getPrivateKey(account));

export const getAddress = account =>
  EthCrypto.publicKey.toAddress(getPublicKey(account));

export const getAccount = account => ({
  number: account,
  address: getAddress(account),
  publicKey: getPublicKey(account),
});

export const getAccounts = () =>
  privateKeys.map((_, account) => getAccount(account));
