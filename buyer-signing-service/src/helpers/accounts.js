import hdkey from 'ethereumjs-wallet/hdkey';
import config from '../../config';

const buyerHD = hdkey.fromMasterSeed(config.buyer.seed);

const childWallet = childId => buyerHD.deriveChild(childId).getWallet();

export const getPrivateKey = childId => childWallet(childId).getPrivateKeyString();

export const getPublicKey = childId => childWallet(childId).getPublicKeyString();

export const getAddress = childId => childWallet(childId).getAddressString();

export const getAccount = childId => ({
  number: childId,
  address: getAddress(childId),
  publicKey: getPublicKey(childId),
});

export const getAccounts = () => {
  const numAccounts = Number(config.buyer.buckets);
  const accounts = [];

  for (let i = 0; i < numAccounts; i += 1) {
    accounts.push(getAccount(i));
  }

  return accounts;
};
