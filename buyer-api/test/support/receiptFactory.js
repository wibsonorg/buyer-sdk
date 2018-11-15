import { web3 } from '../../src/utils';

let _blockNumber = 0;
let _transactionIndex = 0;

const nextBlockNumber = () => _blockNumber+=1 && _blockNumber;
const nextTransactionIndex = () => _transactionIndex+=1 && _transactionIndex;
const generateRandomNumber = (min, max) => Math.round(Math.random() * (max-min) + min);

export default ({ from, to, status = '0x1' }) => {
  const blockNumber = `0x${nextBlockNumber().toString(16)}`;
  const blockHash = web3.utils.sha3(blockNumber);

  const transactionIndex = `0x${nextTransactionIndex().toString(16)}`;
  const transactionHash = web3.utils.sha3(transactionIndex);

  const gasUsed = `0x${generateRandomNumber(10000, 50000).toString(16)}`;

  const f = from || `0x${web3.utils.sha3(blockHash).slice(34)}`;
  const t = to || `0x${web3.utils.sha3(transactionHash).slice(34)}`;

  return {
    blockHash,
    blockNumber,
    contractAddress: null,
    from: f,
    to: t,
    gasUsed,
    cumulativeGasUsed: gasUsed,
    // TODO: logs and logsBloom fields break the tests if added randomly.
    status,
    transactionHash,
    transactionIndex
  }
};
