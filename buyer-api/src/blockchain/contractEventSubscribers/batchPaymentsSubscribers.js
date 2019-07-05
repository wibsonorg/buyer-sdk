import config from '../../../config';
import { jobify } from '../../utils/jobify';
import { BatPay, decodeLogs } from '../contracts';
import web3 from '../../utils/web3';
import { orderStats } from '../../utils/stores';

const { batPayId } = config;

export const updateBuyerStats = async (
  { payIndex, from, totalNumberOfPayees }, { transactionHash },
) => {
  if (batPayId !== Number(from)) return; // We didn't perform this payment
  const { metadata: dxHash } = await BatPay.methods.payments(payIndex).call();
  const { logs } = await web3.eth.getTransactionReceipt(dxHash);
  const { gasUsed } = await web3.eth.getTransactionReceipt(transactionHash);
  const { gasPrice } = await web3.eth.getTransaction(transactionHash);
  const ethUsed = Number(gasPrice) * Number(gasUsed);
  const { orderId } = await decodeLogs(logs);

  await orderStats.update(
    Number(orderId),
    oldStat => ({
      ethSpent: oldStat.ethSpent + ethUsed,
      amountOfPayees: oldStat.amountOfPayees + Number(totalNumberOfPayees),
      paymentsRegistered: oldStat.paymentsRegistered + 1,
    }),
    { ethSpent: 0, amountOfPayees: 0, paymentsRegistered: 0 },
  );
};

export const onPaymentRegistered = jobify(updateBuyerStats);
