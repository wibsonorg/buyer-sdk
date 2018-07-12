import EthUtil from 'ethereumjs-util';
import EthCrypto from 'eth-crypto';

export const generateData = (
  functionSignature,
  parameterNames,
  transactionParameters,
) => {
  const func = EthUtil.keccak256(functionSignature).slice(0, 4).toString('hex');
  const args = parameterNames.map((parameterName) => {
    const value = transactionParameters[parameterName];

    return EthUtil.setLengthLeft(value, 32).toString('hex');
  });
  const argsStr = args.join('');

  return `0x${func}${argsStr}`;
};

export const signTransaction = (rawTransaction, privateKey) =>
  EthCrypto.signTransaction(rawTransaction, privateKey);
