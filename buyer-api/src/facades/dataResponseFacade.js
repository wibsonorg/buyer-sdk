import web3 from '../utils/web3';
import signingService from '../services/signingService';

const addDataResponse = async (order, seller, notary, dataHash, signature) => {
  const params = { order, seller, notary, dataHash, signature };

  const { address } = await signingService.getAccount();
  const nonce = await web3.eth.getTransactionCount(address);

  const { signedTransaction } = await signingService.signAddDataResponse({ nonce, params });

  const receipt = await web3.eth.sendRawTransaction(`0x${signedTransaction}`);
  await web3.eth.getTransactionReceipt(receipt);
  // TODO: Check receipt

  return true;
};

export default addDataResponse;
