import config from '../../../config';
import { jobify } from '../../utils/jobify';
import { BatPay, decodeLogs } from '../contracts';
import web3 from '../../utils/web3';
import { orderStats } from '../../utils/stores';

const { batPayId } = config;

export const updateBuyerStats = async ({ payIndex, from, totalNumberOfPayees }) => {
  if (batPayId !== Number(from)) return; // We didn't perform this payment
  const { metadata: dxHash } = await BatPay.methods.payments(payIndex).call();
  const { gasPrice } = await web3.eth.getTransaction(dxHash);
  const { gasUsed, logs } = await web3.eth.getTransactionReceipt(dxHash);
  const ethUsed = Number(gasPrice) * Number(gasUsed);
  const { orderId } = await decodeLogs(logs);
  orderStats.update(Number(orderId), [{
    ethSpent: ethUsed,
    amountOfPayees: Number(totalNumberOfPayees),
  }], []);
};

export const onPaymentRegistered = jobify(updateBuyerStats);
