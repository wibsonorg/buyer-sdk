import EthCrypto from 'eth-crypto';
import config from '../../config';

const publicKey = EthCrypto.publicKeyByPrivateKey(config.buyer.privateKey);
const address = EthCrypto.publicKey.toAddress(publicKey);

export default { publicKey, address };
