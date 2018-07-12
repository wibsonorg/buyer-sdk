import EthCrypto from 'eth-crypto';
import config from '../../config';

let publicKey;
let address;

export const getPrivateKey = () => config.buyer.privateKey;

export const getPublicKey = () => {
  if (!publicKey) {
    publicKey = EthCrypto.publicKeyByPrivateKey(getPrivateKey());
  }

  return publicKey;
};

export const getAddress = () => {
  if (!address) {
    address = EthCrypto.publicKey.toAddress(getPublicKey());
  }

  return address;
};
