import hdkey from 'ethereumjs-wallet/hdkey';
import config from '../../config';

const buyerHD = hdkey.fromMasterSeed(config.buyer.seed);

const childWallet = childId => buyerHD.deriveChild(childId).getWallet();

export const getPrivateKey = childId =>
  childWallet(childId).getPrivateKeyString()
    .replace(/^0x/, '')
    .toLowerCase();

export const getPublicKey = childId =>
  childWallet(childId).getPublicKeyString()
    .replace(/^0x/, '')
    .toLowerCase();

export const getAddress = childId => childWallet(childId).getAddressString();

export const getRootAccountPrivateKey = () =>
  buyerHD.getWallet().getPrivateKeyString()
    .replace(/^0x/, '')
    .toLowerCase();

export const getRootAccountAddress = () =>
  buyerHD.getWallet().getAddressString();

export const getRootAccount = () => ({
  number: 'root',
  address: getRootAccountAddress(),
  publicKey: buyerHD.getWallet().getPublicKeyString(),
});

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
